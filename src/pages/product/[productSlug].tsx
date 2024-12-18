import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Breadcrumb, Product, ProductAttribute } from '@/types/types';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import minioClient from '@/utils/minioClient';
import { auth } from '@/utils/auth';

interface ProductPageProps {
  initialProductData: Product | null;
}
// Экспортируем асинхронную функцию getServerSideProps, которая будет вызываться на сервере перед рендерингом страницы
export async function getServerSideProps({ params }: { params: { productSlug: string } }) {
  // Проверяем, существует ли параметр productSlug в объекте params
  if (!params?.productSlug) {
    // Если productSlug отсутствует, выводим сообщение в консоль
    console.log('productSlug отсутствует');
    // Возвращаем объект с полем notFound, чтобы указать, что страница не найдена
    return {
      notFound: true,
    };
  }

  try {
    const response = await axios.get(`http://192.168.31.40:4000/api/product/${params.productSlug}`);
    const productData = response.data;
    if (!productData || !productData.data) {
      console.log('Данные продукта отсутствуют');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialProductData: { 
          ...productData.data, 
        },
      },
    };

  } catch (error) {
    console.error('Ошибка в getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

// Добавьте этот интерфейс перед компонентом ProductPage
interface FileGroup {
  title: string;
  files: Array<{
    FileName: string;
    FileURL: string;
    FileType: string;
  }>;
}

const fileTypeMap: Record<string, string> = {
  'TD': 'Технические данные',
  'PD': 'IES',
  'IG': 'Инструкция по монтажу',
  'BIM': 'BIM-модель'
};

// В компоненте ProductPage добавьте функцию для группировки файлов
const groupFiles = (files: any[]): FileGroup[] => {
  const groups: { [key: string]: FileGroup } = {
    'Техническая информация': {
      title: 'Техническая информация',
      files: files.filter(f => ['TD', 'PD', 'IG', 'BIM'].includes(f.FileType))
        .map(f => ({
          ...f,
          FileName: fileTypeMap[f.FileType] || f.FileName
        }))
    },
    'Декларация соответствия': {
      title: 'Декларация соответствия',
      files: files.filter(f => f.FileType === 'DCLR')
    },
    'Сертификат соответствия': {
      title: 'Сертификат соответствия', 
      files: files.filter(f => f.FileType === 'CRTF')
    },
    'Протокол испытаний': {
      title: 'Протокол испытаний',
      files: files.filter(f => f.FileType === 'PRTC')
    },
    'Заключение Минпромторга': {
      title: 'Заключение Минпромторга',
      files: files.filter(f => f.FileType === 'CNCL')
    }
  };

  return Object.values(groups).filter(group => group.files.length > 0);
};

const monthsShort: { [key: string]: string } = {
  '01': 'янв',
  '02': 'фев',
  '03': 'мар',
  '04': 'апр',
  '05': 'май',
  '06': 'июн',
  '07': 'июл',
  '08': 'авг',
  '09': 'сен',
  '10': 'окт',
  '11': 'ноя',
  '12': 'дек'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return {
    day,
    month: monthsShort[month]
  };
};

// Общие настройки для всех Lightbox компонентов
const lightboxConfig = {
  plugins: [Thumbnails, Zoom],
  styles: {
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      '& .yarl__toolbar': {
        backgroundColor: 'black',
        borderRadius: '15px'
      },
      '& .yarl__navigation': {
        backgroundColor: 'black',
        borderRadius: '15px'
      }
    },
    thumbnails: {
      padding: '10px 0',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      '& .yarl__thumbnails_vignette': {
        background: 'none !important'
      }
    },
    thumbnail: {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      border: 'none',
      borderRadius: '4px',
      padding: '2px',
    },
    thumbnailsContainer: {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      padding: '10px 0',
    }
  },
  zoom: {
    maxZoomPixelRatio: 100, // Максимальное соотношение пикселей для увеличения
    zoomInMultiplier: 2, // Множитель для увеличения при зуме
    doubleTapDelay: 300, // Задержка для двойного нажатия в миллисекундах
    doubleClickDelay: 300, // Задержка для двойного клика в миллисекундах
    doubleClickMaxStops: 2, // Максимальное количество остановок при двойном клике
    keyboardMoveDistance: 50, // Расстояние перемещения при использовании клавиатуры
    wheelZoomDistanceFactor: 1000, // Фактор увеличения при прокрутке колесика мыши
    pinchZoomDistanceFactor: 1000, // Фактор увеличения при сжатии на сенсорном экране
    scrollToZoom: true, // Включение зума при прокрутке
  }
};

export default function ProductPage({ initialProductData }: ProductPageProps) {
  const router = useRouter();
  const [productData, setProductData] = useState<Product | null>(initialProductData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isProductLightboxOpen, setIsProductLightboxOpen] = useState(false);
  const [isDrawingLightboxOpen, setIsDrawingLightboxOpen] = useState(false);
  const [isDistributionLightboxOpen, setIsDistributionLightboxOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!productData) return <div>Продукт не найден</div>;

  // Подготавливаем данные для Lightbox
  const lightboxImages = productData.Images?.map(image => ({
    src: image.ImageURL,
    alt: productData.Name,
  })) || [];

  // Подготавливаем разные наборы изображений
  const productImages = productData.Images?.map(image => ({
    src: image.ImageURL,
    alt: productData.Name,
  })) || [];

  const drawingImage = [{
    src: "/files_for_test/GB-promled-projector-800x800.jpg",
    alt: "Габаритный чертеж"
  }];

  const distributionImage = [{
    src: "/files_for_test/KC-promled-projector-430x430.jpg",
    alt: "Светораспределение"
  }];

  return (
    <div>
      <Breadcrumbs />
      <div className="flex">
        {/* Left column - 15% */}
        <div className="w-[15%]  pl-[15px]"></div>

        {/* Center column - 70% */}
        <div className="w-[70%] px-[15px]">
          {productData ? (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 md:mr-4">
                <div className="relative">
                  <div className="mb-4" id="main-image">
                    {productData.Images?.[currentImageIndex] ? (
                      <div 
                        onClick={() => setIsProductLightboxOpen(true)} 
                        className="cursor-pointer"
                      >

                        <Image
                          src={productData.Images[currentImageIndex].ImageURL}
                          alt={productData.Name}
                          className="w-full h-auto"
                          width={500}
                          height={500}
                        />
                      </div>
                    ) : (
                      <Image src="/placeholder.png" alt="Нет изображения" width={500} height={500} />
                    )}
                  </div>
                  <div className="flex overflow-x-auto">
                    {productData.Images?.map((image, index) => (
                      <div key={index} className="flex flex-col">
                        <Image
                          src={image.ImageURL}
                          alt={productData.Name}
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => setCurrentImageIndex(index)}
                          width={100}
                          height={100}
                          style={{ marginRight: '10px' }}
                        />
                      </div>
                    )) || <Image src="/placeholder.png" alt="Нет изображения" width={100} height={100} />}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className='flex flex-col pt-[10px] pb-[25px]'>
                  <h1 className="text-[25px] text-[#2c364c] pt-[0px] pb-[0px] font-nunito-sans font-[500]">{productData.Name}</h1>
                  <p className='text-[#808080]'>Артикул: {productData.SKU}</p>
                </div>
                {productData.Tags && productData.Tags.length > 0 && (
                  <p>Теги: {productData.Tags.map(tag => tag.Name).join(', ')}</p>
                )}
                {isAuthenticated ? (
                    <p className="text-[24px] text-[#2c364c] font-medium">Цена: {productData.Price} ₽</p>
                ) : (
                    <p className="text-[24px] text-[#2c364c] font-medium">Цена: после авторизации</p>
                )}
                <div className="mt-[200px]">
                  <h2 className="text-[20px] text-[#2c364c] font-semibold mb-2 border-b-[2px] border-PLGreen ">Описание</h2>
                  <p className="text-[#2c364c]" dangerouslySetInnerHTML={{ __html: productData.Description }} />
                </div>
              </div>
            </div>
          ) : (
            <div>Продукт не найден</div>
          )}
          {console.log(productData)}
          {/* Технические характеристики */}
          <div className="mt-4">
            <h2 className="text-[20px] text-[#2c364c] font-semibold border-b-[2px] border-PLGreen pb-[10px]">Характеристики</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[25px]">
              {productData?.ProductAttributes?.length && productData.ProductAttributes.length > 0 ? (
                Object.entries(productData.ProductAttributes.reduce((acc, attr) => {
                  const group = acc[attr.AttributeGroupName] || [];
                  group.push(attr);
                  acc[attr.AttributeGroupName] = group;
                  return acc;
                }, {} as Record<string, ProductAttribute[]>)).map(([groupName, attrs]) => (
                  <div key={groupName} className="col-span-1">
                    <h3 className="font-semibold text-[18px] font-medium text-[#333333] mb-[10px] border-b-[1px] border-PLGreen w-fit">{groupName}</h3>
                    {attrs.map((attr: ProductAttribute) => (
                      <div key={attr.AttributeID} className={`${attrs.indexOf(attr) % 2 !== 1 ? 'bg-[#efefef]' : ''} mx-[15px] py-[5px] pl-[10px] pr-[25px]  border-t-[1px] border-[#e0e0e0] text-[15px] flex justify-between`}>
                        <strong className='font-[500]'>{attr.AttributeName}:</strong> <div className='pr-[15px]'>{attr.Value}</div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>Нет технических характеристик</div>
              )}
            </div>
          </div>
          {/* Габаритный чертеж  файл светораспределения */}
          <div className="mt-4 flex flex-row p-[35px]">
            <div className='w-1/2'>
              <div className='border-b-2 border-[#5cd69c] leading-[32px] mb-[25px] text-[20px] font-semibold mb-[5px] w-fit'>
                Габаритный чертеж
              </div>
              <div onClick={() => setIsDrawingLightboxOpen(true)}>
                <Image 
                  src="/files_for_test/GB-promled-projector-800x800.jpg"
                  alt="Габаритный чертеж"
                  className="w-full h-auto p-[15px] cursor-pointer"
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div className='w-1/2'>
              <div className='border-b-2 border-[#5cd69c] leading-[32px] mb-[25px] text-[20px] font-semibold mb-[5px] w-fit'>
                Cветораспределения
              </div>
              <div onClick={() => setIsDistributionLightboxOpen(true)}>
                <Image 
                  src="/files_for_test/KC-promled-projector-430x430.jpg"
                  alt="Cветора��пределения"
                  className="w-full h-auto p-[15px] cursor-pointer"
                  width={500}
                  height={500}
                />
              </div>
            </div>
            
            {/* <h2 className="text-xl font-semibold">Документация</h2> */}
            {/* <p>Габаритный чертеж: <a href={productData?.ProductFiles?.find((file: any) => file.FileName.includes('чертеж'))?.FileURL || '#'} className="text-blue-500">Скачать</a></p> */}
            {/* <p>Файл светораспределения: <a href={productData?.ProductFiles?.find((file: any) => file.FileName.includes('светораспределение'))?.FileURL || '#'} className="text-blue-500">Скачать</a></p> */}
          </div>
          {/* Остальные связанные файлы */}
          {console.log(productData)}
          {productData?.Files && productData.Files.length > 0 && (
            <div id="documents" className="mt-4">
              <h2 className="border-b-2 border-[#5cd69c] leading-[32px] mb-[25px] text-[20px] font-semibold">
                Документы для скачивания
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {groupFiles(productData.Files).map((group, index) => (
                  <div key={index} className="mb-4">
                    <span className="w-full text-[15px] font-medium inline-block border-b border-[#dddddd]">{group.title}</span>
                    <div>
                      {group.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="boxFile">
                          <a 
                            href={file.FileURL}
                            className="flex items-center my-[5px] mx-0"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className={`w-[30px] h-[30px] bg-no-repeat bg-[length:30px] ${
                              file.FileType === 'TD' ? 'bg-pdf' :
                              file.FileType === 'PD' ? 'bg-file' :
                              file.FileType === 'IG' ? 'bg-pdf' :
                              file.FileType === 'BIM' ? 'bg-zip' :
                              file.FileType === 'DCLR' ? 'bg-pdf' :
                              file.FileType === 'CRTF' ? 'bg-pdf' :
                              file.FileType === 'PRTC' ? 'bg-pdf' :
                              file.FileType === 'CNCL' ? 'bg-url' : ''
                            }`}></i>
                            <span className="ml-[10px]">{file.FileName}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Связанные продукты */}
          {productData?.RelatedProducts?.length > 0 && (
            <div className="mt-4 w-full">
              <h2 className="text-xl font-semibold">Связанные продукты</h2>
              <ul>
                {productData.RelatedProducts.map((relatedProduct: any) => (
                  <li key={relatedProduct.ProductID}>
                    <a href={`/product/${relatedProduct.SeoURL}`} className="text-blue-500">{relatedProduct.Name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Связанные проекты */}
          {productData?.RelatedProjects?.length > 0 && (
            <div className="mt-4">
              <h2 className="border-b-2 border-[#5cd69c] leading-[32px] mb-[25px] text-[20px] font-semibold">
                Связанные проекты
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productData.RelatedProjects.slice(0, showMore ? undefined : 3).map((project: any) => (
                  <a href={`/project/${project.fullPath}`} key={project.ProjectID} className="relative overflow-hidden rounded-[15px] flex flex-col shadow-lg">
                    {project.Images?.[0] && (
                      <div className="relative">
                        <Image
                          src={project.Images[0].ImageURL}
                          alt={project.Images[0].AltText || project.Title}
                          className="w-full h-full object-cover rounded"
                          width={500}
                          height={600}
                          priority={false}
                        />
                      </div>
                    )}
                    <div className='z-50 absolute bottom-[0px] left-[0px] w-full pb-[15px] pr-[10px] flex flex-row bg-white bg-opacity-100 font-manrope'>
                      <span className="text-gray-600 text-sm flex flex-col p-[10px] pl-0">
                        <div className='text-[18px] font-[500] text-[#2C364C] text-center bg-[#f7f7f7] bg-opacity-100 opacity-100 px-[10px] py-[2px] font-manrope'>{formatDate(project.CreatedAt).day}</div>
                        <div className='text-[15px] font-[400] text-[#f7f7f7] text-center bg-[#2C364C] bg-opacity-100 opacity-100 px-[10px] py-[2px] font-manrope'>{formatDate(project.CreatedAt).month}</div>
                      </span>
                      <div className="text-lg font-semibold mb-2 flex items-center text-white">
                        <h3 className="text-[#2C364C] font-manrope text-[17px] font-[400]">
                          {project.Title}
                        </h3>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {productData.RelatedProjects.length > 3 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="bg-PLGreen hover:bg-[#4cb587] text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                  >
                    {showMore ? 'Показать меньше' : 'Показать еще'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - 15% */}
        <div className="w-[15%] pr-[15px]"></div>

      </div>

      {/* Lightbox component */}
      <Lightbox
        open={isProductLightboxOpen}
        close={() => setIsProductLightboxOpen(false)}
        slides={productImages}
        index={currentImageIndex}
        {...lightboxConfig}
      />

      <Lightbox
        open={isDrawingLightboxOpen}
        close={() => setIsDrawingLightboxOpen(false)}
        slides={drawingImage}
        {...lightboxConfig}
      />

      <Lightbox
        open={isDistributionLightboxOpen}
        close={() => setIsDistributionLightboxOpen(false)}
        slides={distributionImage}
        {...lightboxConfig}
      />
    </div>
  );
}
