import { useRouter } from 'next/router';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { categorySlug, projectSlug } = router.query;

  return (
    <div>
      <h1 className="text-2xl font-bold">Проект: {projectSlug}</h1>
      {/* Здесь можно добавить компонент для отображения деталей проекта */}
    </div>
  );
} 