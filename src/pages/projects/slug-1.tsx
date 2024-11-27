import { useRouter } from 'next/router';

export default function ProjectCategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1 className="text-2xl font-bold">Категория проекта: {slug}</h1>
      {/* Здесь можно добавить компонент для отображения проектов в категории */}
    </div>
  );
} 