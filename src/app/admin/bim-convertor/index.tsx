import React, { useState } from 'react';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import iconv from 'iconv-lite';

interface ProcessedData {
  originalNames: string[];
  xlsxBuffer?: ArrayBuffer;
}

// Обновляем интерфейс для хранения маппинга файлов
interface NameMapping {
  newName: string;
  newPhotometry: string;
  oldPhotometry: string;
}

const BimConvertor: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [nameMapping, setNameMapping] = useState<Map<string, NameMapping>>(new Map());
  const [originalZipFile, setOriginalZipFile] = useState<File | null>(null);
  const [seriesName, setSeriesName] = useState<string>('');
  const [manufacter, setManufacter] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleBimUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setOriginalZipFile(file);

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      const txtFile = Object.values(zipContent.files).find(file => 
        !file.dir && file.name.endsWith('.txt') && !file.name.includes('/')
      );

      if (!txtFile) {
        throw new Error('TXT файл не найден в корне архива');
      }

      const binaryContent = await txtFile.async('uint8array');
      const content = iconv.decode(Buffer.from(binaryContent), 'utf16le');

      Papa.parse(content, {
        delimiter: ',',
        header: false,
        complete: (results: any) => {
          if (results.data && results.data.length > 0) {
            const rows = results.data.slice(1).map((row: any[]) => ({
              name: row[0]?.trim(), // Название
              photometry: row[1]?.trim(), // Файл фотометрии
            }))
            .filter((row: any) => row.name && row.name.length > 1);

            const ws = XLSX.utils.aoa_to_sheet([
              ['Наименование Promled', 'Наименование партнера', 'Файл фотометрии Promled', 'Имя файла фотометрии партнера'],
              ...rows.map((row: any) => [row.name, '', row.photometry, ''])
            ]);

            ws['A1'].s = { font: { bold: true } };
            ws['B1'].s = { font: { bold: true } };
            ws['C1'].s = { font: { bold: true } };
            ws['D1'].s = { font: { bold: true } };

            ws['!cols'] = [
              { wch: 50 },
              { wch: 50 },
              { wch: 45 },
              { wch: 45 }
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Products');
            
            const xlsxBuffer = XLSX.write(wb, { 
              type: 'buffer',
              bookType: 'xlsx',
              bookSST: false
            });

            setProcessedData({
              originalNames: rows.map((r: any) => r.name),
              xlsxBuffer: xlsxBuffer
            });
            setUploadedFile(file);
          }
        },
        error: (error: any) => {
          console.error('Ошибка парсинга CSV:', error);
          alert('Ошибка при обработке файла');
        }
      });

    } catch (error) {
      console.error('Ошибка обработки архива:', error);
      alert('Ошибка при обработке архива');
    }
  };

  const downloadTemplate = () => {
    if (!processedData?.xlsxBuffer) {
      alert('Ошибка: файл не сгенерирован');
      return;
    }

    const blob = new Blob([processedData.xlsxBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.xlsx';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Создаем мапу соответствий названий и файлов фотометрии
      const nameMapping = new Map(
        data.map((row: any) => [
          row['Наименование Promled'],
          {
            newName: row['Наименование партнера'],
            newPhotometry: row['Имя файла фотометрии партнера'],
            oldPhotometry: row['Файл фотометрии Promled']            
          }
        ])
      );

      setNameMapping(nameMapping);
      setUploadedFile(file);
    } catch (error) {
      console.error('Ошибка при чтении XLSX:', error);
      alert('Ошибка при чтении файла');
    }
  };

  const generateArchive = async () => {
    if (!processedData || !nameMapping || !originalZipFile) {
      alert('Необходимо загрузить все файлы');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const newZip = new JSZip();
      const oldZip = await JSZip.loadAsync(originalZipFile);
      setProgress(10);

      // Находим txt файл
      const txtFile = Object.values(oldZip.files).find(file => 
        !file.dir && file.name.endsWith('.txt') && !file.name.includes('/')
      );

      if (!txtFile) {
        throw new Error('TXT файл не найден в корне архива');
      }

      const binaryContent = await txtFile.async('uint8array');
      let content = iconv.decode(Buffer.from(binaryContent), 'utf16le');

      // Разбиваем на строки и обрабатываем
      const lines = content.split('\n');
      
      // Находим индексы нужных колонок из заголовка
      const headers = lines[0].split(',');
      const columnIndexes = {
        name: headers.findIndex(h => h.includes('ADSK_Наименование##OTHER##')),
        photometry: headers.findIndex(h => h.includes('Файл фотометрической сетки##OTHER##')),
        manufacturer: headers.findIndex(h => h.includes('ADSK_Завод-изготовитель##OTHER##')),
        url: headers.findIndex(h => h.includes('URL##OTHER##')),
        description: headers.findIndex(h => h.includes('ADSK_Описание##OTHER##'))
      };

      // Обрабатываем каждую строку
      const updatedLines = lines.map((line, index) => {
        if (!line.trim()) return line;
        
        const columns = line.split(',');

        if (index > 0) { // Пропускаем заголовок
          const oldName = columns[0]?.trim();
          const mapping = nameMapping.get(oldName);
          
          if (mapping?.newName) {
            // 1. Замена в первой колонке
            columns[0] = mapping.newName;
            
            // 2. Замена ADSK_Наименование
            if (columnIndexes.name !== -1) {
              columns[columnIndexes.name] = mapping.newName;
            }

            // 3. Замена файла фотометрии
            if (columnIndexes.photometry !== -1 && mapping.newPhotometry) {
              columns[columnIndexes.photometry] = mapping.newPhotometry;
            }
            
          }

          // 4. Замена производителя
          if (columnIndexes.manufacturer !== -1) {
            columns[columnIndexes.manufacturer] = manufacter;
          }

          // 5. Замена URL и описания на "-"
          if (columnIndexes.url !== -1) {
            columns[columnIndexes.url] = '-';
          }
          if (columnIndexes.description !== -1) {
            columns[columnIndexes.description] = '-';
          }
        }
        
        return columns.join(',');
      });

      // Обновляем контент
      content = updatedLines.join('\n');

      // Сохраняем обновленный txt в новый архив
      const updatedContent = iconv.encode(content, 'windows-1251');
      newZip.file(`${seriesName}.txt`, updatedContent);
      setProgress(30);

      // Обрабатываем IES файлы
      const iesFiles = Object.values(oldZip.files).filter(file => 
        !file.dir && 
        (file.name.toLowerCase().includes('ies/') || file.name.toLowerCase().includes('IES/')) && 
        file.name.toLowerCase().endsWith('.ies')
      );

      const getNewIESdata = (oldPhotometry: string): [string | undefined, string | undefined] => {
        for (const [key, mapping] of nameMapping) {
          if (mapping.oldPhotometry === oldPhotometry) {
            return [mapping.newPhotometry, mapping.newName];
          }
        }
        return [undefined, undefined];
      };

      // Добавляем только переименованные IES файлы
      for (const iesFile of iesFiles) {
        const oldName = iesFile.name.split('/').pop();
        console.log('oldName: ', oldName);
        if (!oldName) continue;
        const newIESdata = getNewIESdata(oldName.replace('.ies', ''));

        if (newIESdata) {
          // Получаем содержимое файла как текст
          const fileContent = await iesFile.async('text');
          
          // Получаем новое название светильника из txt файла
          const newLuminaireName = newIESdata[1];
          
          if (newLuminaireName) {
            // Заменяем название светильника в заголовке
            const updatedContent = fileContent.replace(
              /(\[LUMINAIRE\]).*/, 
              `$1 ${newLuminaireName}`
            );
            
            // Сохраняем обновленный файл
            const newPath = iesFile.name.replace(oldName, `${newIESdata[0]}.ies`);
            newZip.file(newPath, updatedContent);
            
          }
        }
      }
      setProgress(70);

      // Копируем нужные файлы (кроме IES и PDF)
      for (const [path, file] of Object.entries(oldZip.files)) {
        if (!file.dir && 
            !path.toLowerCase().includes('ies/') && 
            !path.toLowerCase().includes('IES/') &&
            !path.toLowerCase().endsWith('.pdf')) {
          
          const content = await file.async('uint8array');
          
          // Переименовываем .rfa и .txt файлы
          if (!path.includes('/')) {
            const extension = path.toLowerCase().split('.').pop() || '';
            if (extension === 'rfa') {
              const newPath = `${seriesName}.${extension}`;
              newZip.file(newPath, content);
            } else if (extension === 'bat') {
              // Получаем содержимое файла как текст
              let fileContent = await file.async('text');
              // Заменяем PROMLED на manufacter
              fileContent = fileContent.replace(/PROMLED/g, manufacter);
              // Сохраняем обновленный .bat файл
              newZip.file(path, fileContent);
            }
          } else {
            // Остальные файлы (не в корне) копируем как есть
            newZip.file(path, content);
          }
        }
      }
      setProgress(90);

      // Генерируем новый архив
      const updatedZip = await newZip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      setProgress(100);

      // Скачиваем архив
      const url = window.URL.createObjectURL(updatedZip);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${seriesName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Ошибка при генерации архива:', error);
      alert('Ошибка при генерации архива');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

 return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Конвертор BIM моделей</h1>
      
      <div className="space-y-8">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 
              border-blue-500 bg-blue-500 text-white mr-3">
              1
            </div>
            <div>
              <div className="text-xl font-medium mb-4">Загрузите архив с BIM моделями PromLED</div>
              <div className="text-s text-gray-500">1.1 Скачайте архив с BIM моделями на странице продукта promled.com</div>
              <div className="text-s text-gray-500">1.2 Выберите архив с BIM моделями</div>
            </div>
          </div>
          
          <div className="ml-11">
            <div className="text-sm text-gray-600 mb-4">
              Например: BIM-promled-profi_neo-#-#-#-#-#-#-#-#-#-#-#.zip
            </div>
            <label className="block">
              <input
                type="file"
                accept=".zip,.rar,.7z"
                onChange={handleBimUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </label>
          </div>
        </div>

        <div className={`border rounded-lg p-4 bg-white shadow-sm ${uploadedFile ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${uploadedFile ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'} mr-3`}>
              2
            </div>
            <div>
              <div className="text-xl pt-4 font-medium mb-4">Скачать таблицу светильников PromLED</div>
              <div className="text-s text-gray-500">2.1 Скачайте таблицу светильников PromLED из загруженного архива в xlsx формате</div>
              <div className="text-s text-gray-500">2.2 Заполните колонку B "Наименование партнера" вашими наименованиями светильников</div>
              <div className="text-s text-gray-500">2.3 Заполните колонку D "Имя файла фотометрии партнера" желаемыми названими новых файлов фотометрии </div>
              <div className="text-s text-gray-500">2.4 После заполнения файла, загрузите его в шаг 3</div>
              <div className="text-sm text-gray-500 pt-2">См. пример заполненного файла. <a href="/sample-products.xlsx" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 underline">Скачать пример</a> </div>
              <div className="text-s text-red-500 pt-2 font-bold">Внимание! Не изменяйте первую строку файла (заголовки)</div>
            </div>
          </div>
          
          <div className="ml-11">
            <button 
              onClick={downloadTemplate}
              disabled={!processedData?.xlsxBuffer}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2
                ${!processedData?.xlsxBuffer && 'opacity-50 cursor-not-allowed'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Скачать таблицу светильников из архива BIM модели
            </button>
          </div>
        </div>

        <div className={`border rounded-lg p-4 bg-white shadow-sm ${processedData ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${processedData ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'} mr-3`}>
              3
            </div>
            <div>
              <div className="text-xl font-medium mb-4">Загрузка таблицы сопоставления названий</div>
            </div>
          </div>
          
          <div className="ml-11">
            <div className="text-s text-gray-600 mb-4">
              После заполнения таблицы соответствий названий PromLED и ваших наименований, загрузите файл обратно.
            </div>
            <label className="block">
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
                disabled={!processedData}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          </div>
        </div>

        <div className={`border rounded-lg p-4 bg-white shadow-sm ${uploadedFile && processedData ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${uploadedFile && processedData ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-500'} mr-3`}>
              4
            </div>
            <div>
              <div className="text-xl pt-4 font-medium mb-4">Генерация архива с BIM моделями с новыми названиями</div>        
            </div>
          </div>
          
          <div className="ml-11">
            <div className="max-w-2xl text-gray-600 mb-4">
                <label htmlFor="seriesName" className="text-s block mb-1">4.1 Введите свое название серии:</label>
                <input 
                  id="seriesName" 
                  type="text" 
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="Например: GoLED Profi NEO" 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                />
                <label htmlFor="manufacter" className="text-s block mb-1 mt-4">4.2 Введите свое название производителя:</label>
                <input 
                  id="manufacter" 
                  type="text" 
                  value={manufacter}
                  onChange={(e) => setManufacter(e.target.value)}
                  placeholder="Например: GoLED" 
                  className="w-full p-2 border border-gray-300 rounded-md" 
                />
            </div>
            <div className="text-s text-gray-500 pb-4">4.3 Нажмите кнопку "Сгенерировать архив". Автоматически сгенерируется архив с BIM моделями с новыми наименованиями, новыми файлами фотометрии, новым названием производителя и серии</div>
            {isGenerating && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1 text-center">
                  {progress}% завершено
                </div>
              </div>
            )}

            <button 
              onClick={generateArchive}
              disabled={!(uploadedFile && processedData) || isGenerating}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
                ${(!(uploadedFile && processedData) || isGenerating) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isGenerating ? 'Генерация архива...' : 'Сгенерировать архив'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BimConvertor;
