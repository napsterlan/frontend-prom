import { getNewsBySlug, getCategories, getAllProjectCategories } from '@/api';
import { NextPageProps } from '@/types';
import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
import { NewsForm } from '../_components/NewsForm';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';

export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function EditNewsPage({ params, searchParams }: NextPageProps) {
    try {
        const { slug } = await params;

        if (!slug) {
            console.log('not found 404'); 
            return;
        }

        const news = await getNewsBySlug(slug);
        const projectCategories = await getAllProjectCategories();

        const productCategories = await getCategories();

        console.log('news', news);

        if (!news) {
            console.log('not found 404'); 
            return;
        }

        return (
            <BreadcrumbsWrapper pageName={news.data.Name}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Редактирование новости: {news.data.Name}</h1>
                <NewsForm 
                    news={news.data} 
                    projectCategories={projectCategories}
                    productCategories={productCategories}
                    isEditing={true}
                />
            </div>
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        // notFound();
        console.log('not found 404'); 
        return;
    }
} 