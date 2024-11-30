import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProductBySlug } from '@/api/apiClient'; // Импортируйте функцию для получения данных продукта
import { Product } from '@/types/types'; // Предполагается, что у вас есть тип Product
import Image from 'next/image';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query; // Получаем slug продукта из URL
  const [productData, setProductData] = useState<Product | null>(null); // Состояние для данных продукта
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof slug === 'string') {
        try {
          const productData = await getProductBySlug(slug);
          setProductData(productData.data); // Сохраняем данные продукта
        } catch (err) {
          setError('Ошибка при загрузке данных продукта');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {productData ? (
        <div>
          <h1>{productData.Name}</h1>
          <Image src={productData.ProductImages?.[0].ImageURL || '/placeholder.png'} alt={productData.Name} layout="responsive" width={290} height={200} />
          <p>{productData.Description}</p>
          <p>Цена: {productData.Price} ₽</p>
        </div>
      ) : (
        <div>Продукт не найден</div>
      )}
    </div>
  );
}
