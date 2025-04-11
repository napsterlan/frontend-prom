import { getProjectBySlug, getCategories, getAllProjectCategories } from '@/api';
import { Metadata } from 'next';
import { ProjectForm } from '@/app/admin/projects/_components/ProjectForm';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function EditProjectPage({ params, searchParams }: NextPageProps) {
    const { slug } = await params;

    if (!slug) {
        console.log('not found 404'); 
        return;
    }

    try {
        const project = await getProjectBySlug(slug);
        const projectCategories = await getAllProjectCategories();

        const productCategories = await getCategories();

        console.log('project', project);

        if (!project) {
            return {
                notFound: true,
            };
        }

        return (
            <BreadcrumbsWrapper pageName={project.data.Name}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Редактирование проекта: {project.data.Name}</h1>
                <ProjectForm 
                    project={project.data} 
                    projectCategories={projectCategories.data}
                    productCategories={productCategories.data}
                    isEditing={true}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
} 