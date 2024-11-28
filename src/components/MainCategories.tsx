import { useQuery } from 'react-query';
import { getCategories } from '../api/apiClient';

const fetchCategories = async () => {
  try {
    const data = await getCategories();
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к бекенду:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};

export default function MainCategories() {
  const { data, error, isLoading } = useQuery('categories', fetchCategories);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 290px)', gap: '20px' }}>
      {data.data
        .filter((category: any) => category.ParentID === null) // Фильтруем категории с ParentID: null
        .map((category: any) => (
          <a key={category.CategoryID} href={"/catalog/" + category.SeoURL} style={{ width: '290px', height: '400px', border: '1px solid #ccc', textDecoration: 'none', color: 'inherit' }}>
            <img src={category.ImageURL || 'placeholder.png'} alt={category.Name} style={{ width: '100%', height: 'auto' }} />
            <h3 className='text-lg text-left p-4'>{category.Name}</h3>
            <p className='text-left p-4'>{category.SmallDescription}</p>
          </a>
        ))}
    </div>
  );
} 