import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getProjectBySlug } from '@/api/apiClient'; // Импортируем функцию для получения данных проекта
import { Project } from '@/types/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export async function getServerSideProps(context: { params: { categorySlug: string; projectSlug: string } }) {
  const categorySlug = context.params.categorySlug;
  const projectSlug = context.params.projectSlug;
  console.log(projectSlug);
  
  try {
    const response = await getProjectBySlug(projectSlug);
    console.log(projectSlug);
    console.log(response);
    
    return {
      props: {
        project: response.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function ProjectDetailPage({ project }: { project: Project }) {
  const router = useRouter();
  const { categorySlug, projectSlug } = router.query;

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