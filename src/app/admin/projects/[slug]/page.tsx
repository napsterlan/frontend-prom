import { getProjectBySlug, getCategories, getAllProjectCategories } from '@/api/apiClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectForm } from '../_components/project-form';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';

export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

interface Props {
    params: {
        slug: string;
    };
}

export default async function EditProjectPage({ params }: Props) {
    try {
        const project = await getProjectBySlug(params.slug);
        const categories = await getCategories();

        if (!project) {
            notFound();
        }

        return (
            <BreadcrumbsWrapper pageName={project.data.Name}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Редактирование проекта: {project.data.Name}</h1>
                <ProjectForm 
                    project={project.data} 
                    categories={categories.data}
                    isEditing={true}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        notFound();
    }
} 