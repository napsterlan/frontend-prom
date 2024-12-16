import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query'; // Импортируем useQuery из react-query
import { getCategoryBySlug } from '@/api/apiClient';
import { Category, ProductView } from '@/types/types';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Breadcrumb } from '@/types/types';
import { ColumnVisibilityManager, ColumnVisibility } from '@/components/ColumnVisibilityManager';
import { getColumnSettings } from '@/utils/columnSettings';

export default function CategoryPage() {
  const router = useRouter();
  const { categorySlugs } = router.query;
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 100; // Установите размер страницы

  // Используем useQuery для получения данных категории с пагинацией
  const { data: categoryData, isLoading, error } = useQuery(
    ['categoryData', categorySlugs, page],
    () => {
      if (Array.isArray(categorySlugs)) {
        const slugPath = categorySlugs[categorySlugs.length - 1];
        return getCategoryBySlug(slugPath, pageSize, page);
      }
      return Promise.reject('Invalid category slugs');
    },
    {
      enabled: Array.isArray(categorySlugs), // Запрос выполняется только если categorySlugs - массив
    }
  );

  const Category = Array.isArray(categorySlugs) ? categorySlugs[categorySlugs.length - 1] : '';
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(() => 
    getColumnSettings(Category)
  );

  // Обновляем при изменении категории
  useEffect(() => {
    setVisibleColumns(getColumnSettings(Category));
  }, [Category]);

  useEffect(() => {
    if (categoryData) {
      const newBreadcrumbs: Breadcrumb[] = [
        {
          label: 'Каталог',
          href: '/catalog'
        }
      ];

      if (Array.isArray(categorySlugs)) {
        for (let i = 0; i < categorySlugs.length; i++) {
          if (i === categorySlugs.length - 1) {
            newBreadcrumbs.push({
              label: categoryData.data.Name,
              href: `/catalog/${categorySlugs.slice(0, i + 1).join('/')}`
            });
          } else {
            const existingBreadcrumbs: Breadcrumb[] = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]');
            const existingCrumb = existingBreadcrumbs.find(
              crumb => crumb.href === `/catalog/${categorySlugs.slice(0, i + 1).join('/')}`
            );

            if (existingCrumb) {
              newBreadcrumbs.push(existingCrumb);
            }
          }
        }
      }

      sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [categoryData, categorySlugs]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка при загрузке данных</div>;

  const toggleColumn = (column: keyof ColumnVisibility) => {
    const newColumns = {
      ...visibleColumns,
      [column]: !visibleColumns[column]
    };
    setVisibleColumns(newColumns);
    localStorage.setItem(`columns-${Category}`, JSON.stringify(newColumns));
  };

  const resetColumns = () => {
    const defaultSettings = getColumnSettings(Category);
    setVisibleColumns(defaultSettings);
    localStorage.setItem(`columns-${Category}`, JSON.stringify(defaultSettings));
  };

  return (  
    <div>
    <Breadcrumbs />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
      {categoryData?.data.ChildrenCategories ? (
        categoryData.data.ChildrenCategories.map((childCategory: Category) => (
          <div key={childCategory.ID} style={{ border: '1px solid #ccc', borderRadius: '8px', textDecoration: 'none', color: 'inherit', paddingTop: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <a href={`/catalog/${Array.isArray(categorySlugs) ? categorySlugs.join('/') : ''}/${childCategory.Slug}`} style={{ display: 'block', textAlign: 'center' }}>
              <Image src={`/${childCategory.CategoryImages?.[0].image_url}`} alt={childCategory.CategoryImages?.[0].alt_text || childCategory.Name} layout="responsive" width={290} height={200} />
              <div style={{ backgroundColor: 'lightgray', borderRadius: '8px', padding: '10px', width: '100%', textAlign: 'left', fontSize: '12px', minHeight: '75px' }}>
                <p>{childCategory.SmallDescription || ' '}</p>
              </div>
            </a>
          </div>
        ))
      ) : (
        <div>Нет доступных категорий</div>
      )}
    </div>

    <div>
      <ColumnVisibilityManager
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        onReset={resetColumns}
        Category={Category} // Передаем выбранную категорию
      />
      {categoryData?.data.ProductView && categoryData.data.ProductView.length > 0 ? (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {visibleColumns.Name && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Название</th>}
              {visibleColumns.Price && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Цена</th>}
              {visibleColumns.SKU && <th style={{ border: '1px solid #ccc', padding: '10px' }}>SKU</th>}
              {visibleColumns.Power && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Мощность</th>}
              {visibleColumns.LuminousFlux && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Световой поток</th>}
              {visibleColumns.Efficiency && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Эффективность</th>}
              {visibleColumns.ColorTemp && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Цветовая температура</th>}
              {visibleColumns.CRI && <th style={{ border: '1px solid #ccc', padding: '10px' }}>CRI</th>}
              {visibleColumns.ProtectionClass && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Класс защиты</th>}
              {visibleColumns.ClimateExecution && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Климатическое исполнение</th>}
              {visibleColumns.EmergencyPowerUnit && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Аварийный блок питания</th>}
              {visibleColumns.BeamAngle && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Угол луча</th>}
              {visibleColumns.Warranty && <th style={{ border: '1px solid #ccc', padding: '10px' }}>Гарантия</th>}
            </tr>
          </thead>
          <tbody>
            {categoryData.data.ProductView.map((productView: ProductView) => (
              <tr key={productView.ProductID} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/product/${productView.Slug}`}>
                {visibleColumns.Name && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.Name}</td>}
                {visibleColumns.Price && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.Price} ₽</td>}
                {visibleColumns.SKU && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.SKU}</td>}
                {visibleColumns.Power && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.Power}</td>}
                {visibleColumns.LuminousFlux && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.LuminousFlux}</td>}
                {visibleColumns.Efficiency && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.Efficiency}</td>}
                {visibleColumns.ColorTemp && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.ColorTemp}</td>}
                {visibleColumns.CRI && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.CRI}</td>}
                {visibleColumns.ProtectionClass && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.ProtectionClass}</td>}
                {visibleColumns.ClimateExecution && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.ClimateExecution}</td>}
                {visibleColumns.EmergencyPowerUnit && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.EmergencyPowerUnit}</td>}
                {visibleColumns.BeamAngle && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.BeamAngle}</td>}
                {visibleColumns.Warranty && <td style={{ border: '1px solid #ccc', padding: '10px' }}>{productView.Warranty}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Нет доступных продуктов в этой категории</div>
      )}
    </div>

    <div>
      {/* Пагинация */}
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
        Назад
      </button>
      <span>Страница {page}</span>
      <button onClick={() => setPage((prev) => prev + 1)} disabled={!categoryData?.data.ProductView?.length}>
        Вперед
      </button>
    </div>
    </div>
  );
}