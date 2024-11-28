import { useQuery } from 'react-query';
import { getCategoryBySlug } from '../api/apiClient';

// Функция для получения категории по SEO URL
const fetchCategoryBySlug = async (seoURL: string) => {
  try {
    const data = await getCategoryBySlug(seoURL); // Запрос к API для получения данных категории
    return data; // Возвращаем полученные данные
  } catch (error) {
    console.error('Ошибка при запросе данных:', error); // Логируем ошибку
    throw error; // Пробрасываем ошибку дальше
  }
};

// Компонент для отображения категории
export default function Category({ seoURL }: { seoURL: string }) {
  // Используем хук useQuery для получения данных категории
    
  const { data, error, isLoading } = useQuery('category', () => fetchCategoryBySlug(seoURL));
  console.log("1");

  // Проверяем состояние загрузки
  if (isLoading) return <div>Загрузка...</div>; // Показываем индикатор загрузки
  if (error) return <div>Ошибка загрузки данных</div>; // Показываем сообщение об ошибке

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 290px)', gap: '20px' }}>
      {data.data.map((category: any) => (
        <a key={category.CategoryID} href={"/catalog/" + category['full-path']} style={{ width: '290px', height: '400px', border: '1px solid #ccc', textDecoration: 'none', color: 'inherit' }}>
          <img src={category.CategoryImages[0]?.ImageURL || 'placeholder.png'} alt={category.Name} style={{ width: '100%', height: 'auto' }} />
          <h3 className='text-lg text-left p-4'>{category.Name}</h3>
          <p className='text-left p-4'>{category.SmallDescription}</p>
        </a>
      ))}
    </div>
  );
}
