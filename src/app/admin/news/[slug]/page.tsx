import { getNewsBySlug, getCategories } from '@/api';
import { NextPageProps } from '@/types';
import { Metadata } from 'next';
import { NewsForm } from '@/app/admin/news/_components/NewsForm';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';

export const metadata: Metadata = {
    title: 'Редактирование новости',
    description: 'Редактирование существующей новости',
};

export default async function EditNewsPage({ params }: NextPageProps) {
    try {
        const { slug } = await params;
        if (!slug) {
            console.log('not found 404');
            return;
        }
        const news = await getNewsBySlug(slug);
        const productCategories = await getCategories();
        return (
            <BreadcrumbsWrapper pageName="Редактирование новости">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold mb-6">Редактирование новости</h1>
                    <NewsForm 
                        news={news.data}
                        productCategories={productCategories.data}
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