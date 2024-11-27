import { useRouter } from 'next/router';

export default function NewsDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1 className="text-2xl font-bold">Новость: {slug}</h1>
      {/* Здесь можно добавить компонент для отображения деталей новости */}
    </div>
  );
} 