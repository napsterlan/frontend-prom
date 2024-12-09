import { useEffect, useState } from 'react';
import { getAllProjects } from '@/api/apiClient';
import { Project } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data);
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
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.ProjectID} className="relative border rounded-lg p-4">
            {project.ProjectImages?.[0] && (
              <img 
                src={project.ProjectImages[0].ImageURL} 
                alt={project.ProjectImages[0].AltText} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
            <p className="text-gray-600">{project.Description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 