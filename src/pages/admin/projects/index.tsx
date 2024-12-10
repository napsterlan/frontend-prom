import { useEffect, useState } from 'react';
import { getAllProjects } from '@/api/apiClient';
import { Project } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { auth } from '@/utils/auth';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Ошибка при загрузке данных проектов');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.getToken()}`
          }
        });

        if (response.ok) {
          // Обновляем список проектов после удаления
          const updatedProjects = projects.filter(p => Number(p.ID) !== projectId);
          setProjects(updatedProjects);
        }
      } catch (error) {
        console.error('Ошибка при удалении проекта:', error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
        {isAuthenticated && (
          <Link 
            href="/admin/projects/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Добавить проект
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.ID} className="relative border rounded-lg p-4">
            {project.ProjectImages?.[0] && (
              <img 
                src={project.ProjectImages[0].ImageURL} 
                alt={project.ProjectImages[0].AltText} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
            <p className="text-gray-600">{project.Description}</p>
            
            {isAuthenticated && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Link
                  href={`/admin/projects/edit/${project.ID}`}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(project.ID)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 