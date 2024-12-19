import { getAllProjectCategories, getAllProjects } from '@/api/apiClient';
import { Project, ProjectCategory } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Link from 'next/link';

export async function getServerSideProps() {
  
  let projects: Project[] = [];
  let categories: ProjectCategory[] = [];
  let error = null;
  
  try {
    const projectResponse = await getAllProjects();
    projects = projectResponse.data;
    const categoriesResponse = await getAllProjectCategories();
    categories = categoriesResponse.data;
  } catch (err) {
    error = 'Ошибка при загрузке данных проектов';
  }  

  return {
    props: {
      projects,
      categories
    },
  };

}

export default function ProjectsPage({ projects, categories }: { projects: Project[], categories: ProjectCategory[] }) {
  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link href={`/projects/${project.Slug}`} key={project.ProjectID} className="relative border rounded-lg p-4">
            {project.ProjectImages?.[0] && (
              <img 
                src={project.ProjectImages[0].ImageURL} 
                alt={project.ProjectImages[0].AltText} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
            <p className="text-gray-600">{project.Description}</p>
          </Link>
        ))}
=======
      <div className="flex">
        <aside className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Категории проектов</h2>
          <ul>
            {categories.map(category => (
              <li key={category.ID} className="mb-2">
                <Link href={`/projects/${category.Slug}`} className="text-blue-600 hover:underline">
                  {category.Name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-3/4">
          {projects.map((project: Project) => (
            project.ProjectsCategories.length > 0 ? (
              <Link href={`/projects/${project.ProjectsCategories[0].Slug}/${project.Slug}`} key={project.ID} className="relative border rounded-lg overflow-hidden">
                {project.Images?.[0] && (
                  <div 
                    style={{ backgroundImage: `url(${project.Images[0].ImageURL})` }} 
                    className="w-full h-48 bg-cover bg-center rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
                <p className="text-gray-600">{project.Description}</p>
              </Link>
            ) : null
          ))}
        </div>
>>>>>>> c96f7fbacee0fc8d42527efb02b2842583c89c20
      </div>
    </div>
  );
} 