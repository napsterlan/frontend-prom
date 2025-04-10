import { getAllNews } from '@/api';
import { NextPageProps } from '@/types';
import { NewsDataTable } from '../_components/NewsDataTable';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Управление новостями',
    description: 'Административная панель управления новостями',
};

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsPage({ params, searchParams }: NextPageProps) {
    const { page } = await searchParams;
    let news = [];
    let error = null;
    const currentPage = Number(page) || 1;

    try {
        const response = await getAllNews(currentPage);
        news = response.data;
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Новости</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/news/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить новость
                    </Link>
                </div>
                <NewsDataTable 
                    initialData={news} 
                    currentPage={currentPage}
                    totalPages={response.metadata.last_page}
                    totalRecords={response.metadata.total_records}
                />
            </div>
        );
    } catch (err) {
        error = 'Ошибка при загрузке данных новостей';
        console.error('Error fetching news:', err);
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Новости</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/news/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить новость
                    </Link>
                </div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
}