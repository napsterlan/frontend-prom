import { getAllProjectCategories, getAllProjects } from '@/api/apiClient';
import { Project, ProjectCategory } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';

export async function getServerSideProps() {
  
  let projects: Project[] = [];
  let categories: ProjectCategory[] = [];
//   let error = null;
  
  try {
    const projectResponse = await getAllProjects();
    projects = projectResponse.data;
    const categoriesResponse = await getAllProjectCategories();
    categories = categoriesResponse.data;
  } catch {
    // error = 'Ошибка при загрузке данных проектов';
  }  

  return {
    props: {
      projects,
      categories
    },
  };

}

export default function ProjectsPage({ projects}: { projects: Project[], categories: ProjectCategory[] }) {
  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link href={`/projects/${project.Slug}`} key={project.ID} className="relative border rounded-lg p-4">
            {project.ProjectImages?.[0] && (
              <Image 
                src={project.Images[0].ImageURL} 
                alt={project.Images[0].AltText} 
                className="w-full h-48 object-cover rounded mb-4"
                width={500}
                height={192}
                priority={false}
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
            <p className="text-gray-600">{project.Description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 