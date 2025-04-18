import { getNewsBySlug, getCategoryTreeById } from '@/api';
import { ICategory, NextPageProps } from '@/types';
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
        return (
            <BreadcrumbsWrapper pageName={`Редактирование новости: ${news.data.Title}`}>
                <NewsForm 
                        news={news.data}
                        isEditing={true}
                        maxImages={20}
                    />
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching news:', error);
        return {
            notFound: true,
        };
    }
}