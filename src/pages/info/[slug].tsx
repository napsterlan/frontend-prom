import { useRouter } from 'next/router';

export default function InfoDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1 className="text-2xl font-bold">Информационная страница: {slug}</h1>
      {/* Здесь можно добавить компонент для отображения деталей информационной страницы */}
    </div>
  );
} 