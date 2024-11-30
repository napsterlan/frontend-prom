import { getCategories } from '../../api/apiClient';
import Image from 'next/image';
import { Category } from '@/types/types';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function MainCategories() {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
          sessionStorage.setItem('breadcrumbs', JSON.stringify([{ label: 'Каталог', href: '/catalog' }])); // Сбрасываем хлебные крошки
          const categoryData = await getCategories();
          setCategoryData(categoryData.data);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        } finally {
          setLoading(false);
        }
    };

    fetchData().catch(err => {
      // Обработка ошибок
    });
  }, []);

  // Проверка состояния загрузки и ошибок
  if (loading) {
    return <div>Загрузка...</div>;
  }
  if (error) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div>
      <Breadcrumbs />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 290px)', gap: '20px' }}>
        {categoryData.length > 0 && // Проверка на наличие данных
        categoryData
          .filter((category: Category) => category.ParentID === null) // Фильтруем категории с ParentID: null
          .map((category: Category) => {
            return (
              <a key={category.CategoryID} href={category.FullPath} style={{ width: '290px', height: '400px', border: '1px solid #ccc', textDecoration: 'none', color: 'inherit' }}>
                <Image 
                  src={category.CategoryImages?.[0]?.image_url ? `/${category.CategoryImages[0].image_url}` : '/placeholder.png'}
                  alt={category.CategoryImages?.[0]?.alt_text || category.Name} 
                  layout="responsive" 
                  width={290} 
                  height={290} 
                />
                <h3 className='text-lg text-left p-4'>{category.Name}</h3>
                <p className='text-left p-4'>{category.SmallDescription}</p>
              </a>
            );
          })}
      </div>
    </div>
  );
} 