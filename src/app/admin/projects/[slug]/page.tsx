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
            <BreadcrumbsWrapper pageName={`Редактирование проекта: ${project.data.Name}`}>
                <ProjectForm 
                    project={project.data} 
                    projectCategories={projectCategories.data}
                    productCategories={productCategories.data}
                    isEditing={true}
                />
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
} 