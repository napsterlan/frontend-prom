import { useState } from 'react';
import { deleteProjectById, getAllProjects } from '@/api/apiClient';
import { Project } from '@/types/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export const getServerSideProps = async () => {
  let projects = [];
  let error = null;

  try {
    const response = await getAllProjects();
    projects = response.data;
  } catch {
    error = 'Ошибка при загрузке данных проектов';
  }

  return {
    props: {
      projects,
      error,
    },
  };
};

export default function ProjectsPage({ projects: initialProjects }: { projects: Project[], error: string | null }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  const handleDelete = async (projectId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        await deleteProjectById(projectId);
        setProjects(prevProjects => prevProjects.filter(p => p.ID !== projectId));
      } catch (error) {
        console.error('Ошибка при удалении проекта:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Проекты</h1>
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => router.back()} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
        <Link 
          href="/admin/projects/add" 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Добавить проект
        </Link>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Фото</th>
            <th className="py-3 px-6 text-left">Название</th>
            <th className="py-3 px-6 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {projects.map(project => (
            <tr key={project.ID} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">
                <Image 
                  src={project.Images && project.Images.length > 0 ? project.Images[0].ImageURL : '/placeholder.png'} 
                  alt={project.Images && project.Images.length > 0 ? project.Images[0].AltText : 'Заглушка'} 
                  className="object-cover" 
                  width={64}
                  height={64}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
              </td>
              <td className="py-3 px-6">{project.Title}</td>
              <td className="py-3 px-6 text-right">
                <Link
                  href={`/admin/projects/edit/${project.Slug}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                >
                  Редактировать
                </Link>
                <button 
                  onClick={() => handleDelete(project.ID)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}