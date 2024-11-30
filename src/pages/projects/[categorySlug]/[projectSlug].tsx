import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProjectBySlug } from '@/api/apiClient'; // Импортируем функцию для получения данных проекта
import { Project } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { categorySlug, projectSlug } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectSlug) {
        try {
          const response = await getProjectBySlug(projectSlug as string);
          setProject(response.data);
        } catch (err) {
          setError('Ошибка при загрузке данных проекта');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [projectSlug]);

  useEffect(() => {
    // Получаем существующие крошки из sessionStorage
    const savedBreadcrumbs = JSON.parse(sessionStorage.getItem('breadcrumbs') || '[]');
    
    // Добавляем текущий проект к пути
    const updatedBreadcrumbs = [
      ...savedBreadcrumbs,
      {
        label: project?.Title,
        href: `/projects/${categorySlug}/${projectSlug}`
      }
    ];
    
    sessionStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));
  }, [project, categorySlug, projectSlug]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Breadcrumbs />
      <div className="w-full">
        <img src={project?.ProjectImages[0].ImageURL} alt={project?.ProjectImages[0].AltText} className="w-full h-auto" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project?.Title}</h1>
          <p>{project?.Description}</p>
          <h2 className="text-xl font-semibold">Связанные товары</h2>
          <ul>
            {project?.RelatedProducts?.map(product => (
              <li key={product.ProductID}>{product.Name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Информация о менеджере проекта</h2>
          {/* Здесь можно добавить информацию о менеджере проекта */}
        </div>
      </div>
    </div>
  );
} 