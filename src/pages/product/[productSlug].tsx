import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProductBySlug } from '@/api/apiClient'; // Импортируйте функцию для получения данных продукта
import { Breadcrumb, Product, ProductAttribute } from '@/types/types'; // Предполагается, что у вас есть тип Product
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function ProductPage() {
  const router = useRouter();
  const { productSlug } = router.query; // Получаем slug продукта из URL
  const [productData, setProductData] = useState<Product | null>(null); // Состояние для данных продукта
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  
  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Индекс текущего изображения

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof productSlug === 'string') {
        try {
          const productData = await getProductBySlug(productSlug);
          setProductData(productData.data); // Сохраняем данные продукта
          const existingBreadcrumbs: Breadcrumb[] = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]');
          const newBreadcrumbs: Breadcrumb[] = existingBreadcrumbs.filter(crumb => crumb.href !== `/product/${productSlug}`); // Удаляем дублирующий сегмент
          newBreadcrumbs.push({
            label: productData.data.Name,
            href: `/product/${productSlug}`
          });
          // Сохраняем новый путь
          sessionStorage.setItem('breadcrumbs', JSON.stringify(newBreadcrumbs));
          setBreadcrumbs(newBreadcrumbs);
        } catch (err) {
          setError('Ошибка при загрузке данных продукта');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [productSlug]);

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs/>
      {productData ? (
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:mr-4">
            {/* Слайдер изображений продукта с миниатюрами */}
            <div className="relative">
              <div className="flex overflow-x-auto">
                {productData.Images?.map((image, index) => (
                  <Image 
                    key={index} 
                    src={`/${encodeURIComponent(image.ImageURL)}`} 
                    alt={productData.Name} 
                    className="flex-shrink-0 cursor-pointer" 
                    onClick={() => openModal(index)} 
                    width={100} 
                    height={100} 
                    style={{ marginRight: '10px' }} 
                  />
                )) || <Image src="/placeholder.png" alt="Нет изображения" width={100} height={100} />}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{productData.Name}</h1>
            <p>Артикул: {productData.Article}</p>
            <p>Теги: {productData.Tags?.map(tag => tag.Name).join(', ') || 'Нет тегов'}</p>
            <p>Цена: {productData.Price} ₽</p>
            <p>{productData.Description}</p>
          </div>
        </div>
      ) : (
        <div>Продукт не найден</div>
      )}
      {/* Технические характеристики */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Технические характеристики</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productData?.ProductAttributes?.length && productData.ProductAttributes.length > 0 ? (
            Object.entries(productData.ProductAttributes.reduce((acc, attr) => {
              const group = acc[attr.AttributeGroupName] || [];
              group.push(attr);
              acc[attr.AttributeGroupName] = group;
              return acc;
            }, {} as Record<string, ProductAttribute[]>)).map(([groupName, attrs]) => (
              <div key={groupName} className="col-span-1">
                <h3 className="font-semibold">{groupName}</h3>
                {attrs.map((attr: ProductAttribute) => (
                  <div key={attr.AttributeID}>
                    <strong>{attr.AttributeName}</strong>: {attr.Value}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div>Нет технических характеристик</div>
          )}
        </div>
      </div>
      {/* Габаритный чертеж и файл светораспределения */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Документация</h2>
        <p>Габаритный чертеж: <a href={productData?.ProductFiles?.find((file: any) => file.FileName.includes('чертеж'))?.FileURL || '#'} className="text-blue-500">Скачать</a></p>
        <p>Файл светораспределения: <a href={productData?.ProductFiles?.find((file: any) => file.FileName.includes('светораспределение'))?.FileURL || '#'} className="text-blue-500">Скачать</a></p>
      </div>
      {/* Остальные связанные файлы */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Связанные файлы</h2>
        <ul>
          {productData?.ProductFiles?.map((file: any) => (
            <li key={file.FileName}><a href={file.FileURL} className="text-blue-500">{file.FileName}</a></li>
          )) || <li>Нет связанных файлов</li>}
        </ul>
      </div>
      {/* Связанные продукты */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Связанные продукты</h2>
        <ul>
          {productData?.RelatedProducts?.map((relatedProduct: any) => (
            <li key={relatedProduct.ProductID}><a href={`/product/${relatedProduct.SeoURL}`} className="text-blue-500">{relatedProduct.Name}</a></li>
          )) || <li>Нет связанных продуктов</li>}
        </ul>
      </div>
      {/* Связанные проекты */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Связанные проекты</h2>
        <ul>
          {productData?.RelatedProjects?.map((project: any) => (
            <li key={project.ProjectID}><a href={`/project/${project.fullPath}`} className="text-blue-500">{project.Title}</a></li>
          )) || <li>Нет связанных проектов</li>}
        </ul>
      </div>
    </div>
  );
}
