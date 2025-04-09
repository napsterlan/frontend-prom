import { getAllProjectCategories, getProjectCategoryBySlug } from '@/api';
import { Project, ProjectCategory } from '@/types/types';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import Link from 'next/link';

export async function getServerSideProps(context: { params: { categorySlug: string } }) {
  const { categorySlug } = context.params;
 
  let projectsList: Project[] = [];
  let categoriesList: ProjectCategory[] = [];
//   let error = null;
  
  try {
    const projectResponse = await getProjectCategoryBySlug(categorySlug);
    projectsList = projectResponse.data.Projects;
    const categoriesResponse = await getAllProjectCategories();
    categoriesList = categoriesResponse.data;
  } catch  {
    // error = 'Ошибка при загрузке данных проектов';
  }  

  return {
    props: {
      projectsList,
      categoriesList
    },
  };

}

export default function ProjectsPage({ projectsList, categoriesList }: { projectsList: Project[], categoriesList: ProjectCategory[] }) {
  return (
    <div className="container mx-auto px-4">
      <Breadcrumbs />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
      </div>

      <div className="flex">
        <aside className="w-1/4 p-4 border-r">
          <h2 className="text-lg font-bold mb-4">Категории проектов</h2>
          <ul>
            {categoriesList.map(category => (
              <li key={category.ID} className="mb-2">
                <Link href={`/project/${category.Slug}`} className="text-blue-600 hover:underline">
                  {category.Name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-3/4">
          {projectsList.map((project: Project) => (
            <Link href={`/project/${project.Slug}`} key={project.ID} className="relative border rounded-lg overflow-hidden">
              {project.Images?.[0] && (
                <div 
                  style={{ backgroundImage: `url(${project.Images[0].ImageURL})` }} 
                  className="w-full h-48 bg-cover bg-center rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{project.Title}</h3>
              <p className="text-gray-600">{project.Description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 