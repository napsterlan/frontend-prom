import { getProjectCategoryBySlug, getCategoryTreeById } from '@/api';
import { ICategory, NextPageProps } from '@/types';
import { Metadata } from 'next';
import { ProjectCategoryForm } from '@/app/admin/project-catalog/_components/ProjectCategoryForm';

import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';

export const metadata: Metadata = {
    title: 'Редактирование категории проектов',
    description: 'Редактирование существующей категории проектов',
};

export default async function EditProjectCategoryPage({ params }: NextPageProps) {
    try {
        const { slug } = await params;
        if (!slug) {
            console.log('not found 404');
            return;
        }
        const projectCategory = await getProjectCategoryBySlug(slug);
        
        return (
            <BreadcrumbsWrapper pageName="Редактирование категории проектов">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">Редактирование категории проектов</h1>
                    <ProjectCategoryForm 
                        projectCategories={projectCategory.data}
                        isEditing={true}
                    />
                </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching news:', error);
        return {
            notFound: true,
        };
    }
}