import { useEffect, useState } from 'react';
import { getAllProjects } from '@/api/apiClient'; // Импортируйте функцию для получения данных проектов
import { Project } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        sessionStorage.setItem('breadcrumbs', JSON.stringify([{ label: 'Проекты', href: '/projects' }])); // Сбрасываем хлебные крошки
        const response = await getAllProjects();
        setProjects(response.data); // Сохраняем данные проектов
      } catch (err) {
        setError('Ошибка при загрузке данных проектов');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Breadcrumbs/>
      <div className="flex">
        <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold">Категории</h2>
        {/* Здесь можно добавить компонент для отображения категорий */}
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <div key={project.ProjectID} className="border p-4">
              <h3 className="font-semibold">{project.Title}</h3>
              <p>{project.Description}</p>
              <img src={project.ProjectImages[0].ImageURL} alt={project.ProjectImages[0].AltText} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
} 