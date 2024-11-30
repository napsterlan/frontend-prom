import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCategoryBySlug } from '@/api/apiClient'; // Импортируйте функцию для получения данных
import { Category } from '@/types/types';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Breadcrumb } from '@/types/types';

export default function CategoryPage() {
  const router = useRouter();
  const { categorySlugs } = router.query; // Получаем массив сегментов из URL
  const [categoryData, setCategoryData] = useState<Category | null>(null); // Добавляем состояние для данных категории
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (Array.isArray(categorySlugs)) {
        const slugPath = categorySlugs[categorySlugs.length - 1];
        try {
          const categoryData = await getCategoryBySlug(slugPath);
          setCategoryData(categoryData.data);
          
          // Формируем новые хлебные крошки с нуля для текущего пути
          const newBreadcrumbs: Breadcrumb[] = [
            {
              label: 'Каталог',
              href: '/catalog'
            }
          ];

          // Добавляем крошки для каждого уровня текущего пути
          for (let i = 0; i < categorySlugs.length; i++) {
            if (i === categorySlugs.length - 1) {
              // Последний элемент - текущая категория
              newBreadcrumbs.push({
                label: categoryData.data.Name,
                href: `/catalog/${categorySlugs.slice(0, i + 1).join('/')}`
              });
            } else {
              // Промежуточные элементы берем из sessionStorage если есть
              const existingBreadcrumbs: Breadcrumb[] = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]');
              const existingCrumb = existingBreadcrumbs.find(
                crumb => crumb.href === `/catalog/${categorySlugs.slice(0, i + 1).join('/')}`
              );
              
              if (existingCrumb) {
                newBreadcrumbs.push(existingCrumb);
              }
            }
          }
          
          // Сохраняем новый путь
          sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
          setBreadcrumbs(newBreadcrumbs);
          
        } catch (err) {
          setError('Ошибка при загрузке данных');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categorySlugs]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <Breadcrumbs />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {categoryData?.ChildrenCategories ? (
          categoryData.ChildrenCategories.map((childCategory: Category) => (
            <div key={childCategory.ID} style={{ border: '1px solid #ccc', textDecoration: 'none', color: 'inherit', padding: '10px' }}>
              <a href={`/catalog/${Array.isArray(categorySlugs) ? categorySlugs.join('/') : ''}/${childCategory.SeoURL}`} style={{ display: 'block', textAlign: 'center' }}>
                <Image src={`/${childCategory.CategoryImages?.[0].image_url}`} alt={childCategory.CategoryImages?.[0].alt_text || childCategory.Name} layout="responsive" width={290} height={200} />
                <p>{childCategory.SmallDescription}</p>
              </a>
            </div>
          ))
        ) : (
          <div>Нет доступных категорий</div>
        )}
      </div>

      {categoryData?.Products && categoryData.Products.length > 0 ? (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Название</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Цена</th>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Описание</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.Products.map((product) => (
              <tr key={product.ID} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/product/${product.SeoURL}`}>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{product.Name}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{product.SKU}</td>
                <td style={{ border: '1px solid #ccc', padding: '10px' }}>{product.Price} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Нет доступных продуктов в этой категории</div>
      )}
    </div>
  );
}