import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getProjectBySlug } from '@/api';
import { IProject, IImages } from '@/types';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import Image from 'next/image';

export async function getServerSideProps(context: { params: { categorySlug: string; projectSlug: string } }) {
//   const categorySlug = context.params.categorySlug;
  const projectSlug = context.params.projectSlug;
  
  
  try {
    const response = await getProjectBySlug(projectSlug);
    
    console.log(response.data);
    return {
      props: {
        project: response.data,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default function ProjectDetailPage({ project }: { project: IProject }) {
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
        <Image 
          src={project?.ProjectImages?.[0]?.Images?.[0]?.ImageURL || '/placeholder-image.jpg'}
          alt={project?.ProjectImages?.[0]?.Images?.[0]?.AltText || 'Project image'}
          width={1200}
          height={800}
          className="w-full h-auto"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project?.Title}</h1>
          <p>{project?.Description}</p>
          <h2 className="text-xl font-semibold">Связанные товары</h2>
          <ul>
            {project?.RelatedProducts?.map((product: {
                ID: number;
                Name: string;
                Images: IImages[] | null;
                fullPath: string;
            }) => (
              <li key={product.ID}>{product.Name}</li>
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