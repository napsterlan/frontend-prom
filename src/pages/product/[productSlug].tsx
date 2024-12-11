import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { Breadcrumb, Product, ProductAttribute } from '@/types/types';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/Breadcrumbs';

import minioClient from '@/utils/minioClient';

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

    // Получаем URL изображений из MinIO
    const updatedImages = await Promise.all(
      productData.data.Images.map(async (image: any) => {
        try {
          const url = await minioClient.presignedGetObject('promled-website-test', image.ImageURL, 24 * 60 * 60);
          return { ...image, ImageURL: url };
        } catch (err) {
          console.error('Ошибка при получении URL изображения:', err);
          return { ...image, ImageURL: '/placeholder.png' };
        }
      })
    );

    return {
      props: {
        initialProductData: { ...productData.data, Images: updatedImages },
      },
    };

  } catch (error) {
    console.error('Ошибка в getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

export default function ProductPage({ initialProductData }: ProductPageProps) {
  const router = useRouter();
  const [productData, setProductData] = useState<Product | null>(initialProductData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center">Загрузка...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!productData) {
    return <div>Продукт не найден</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs />
      {productData ? (
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:mr-4">
            <div className="relative">
              <div className="mb-4">
                {productData.Images?.[currentImageIndex] ? (
                  <Image
                    src={productData.Images[currentImageIndex].ImageURL}
                    alt={productData.Name}
                    className="w-full h-auto"
                    width={500}
                    height={500}
                  />
                ) : (
                  <Image src="/placeholder.png" alt="Нет изображения" width={500} height={500} />
                )}
              </div>
              <div className="flex overflow-x-auto">
                {productData.Images?.map((image, index) => (
                  <div className="flex flex-col">
                    <Image
                      key={index}
                      src={image.ImageURL}
                      alt={productData.Name}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(index); // Обновляем индекс текущего изображения
                        closeModal(); // Закрываем модальное окно, если оно открыто
                      }}
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
