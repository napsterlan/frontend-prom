import { getAllProjectCategories, getCategories } from '@/api';
import { ProjectCategoriesDataTable } from './_components/ProjectsDataTable';
import Link from 'next/link';
import { Metadata } from 'next';
import { NextPageProps } from '@/types';

export const metadata: Metadata = {
    title: 'Управление категориями проектов',
    description: 'Административная панель управления категориями проектов',
};

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectCategoriesPage({params, searchParams}: NextPageProps) {
    const { page } = await searchParams;
    let projectCategories = [];
    let error = null;
    const currentPage = Number(page) || 1;

    try {
        const response = await getAllProjectCategories();
        projectCategories = response.data;

        console.log('projectCategories: ', projectCategories);
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Категории проектов</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/project-catalog/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить категорию проектов
                    </Link>
                </div>
                <ProjectCategoriesDataTable 
                    initialData={projectCategories}  
                    currentPage={currentPage}
                    // totalPages={response.metadata.last_page}
                    totalPages={1}
                    // totalRecords={response.metadata.total_records}
                    totalRecords={response.data.length}
                />
            </div>
        );
    } catch (err) {
        error = 'Ошибка при загрузке данных проектов';
        console.error('Error fetching project categories:', err);
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Категории проектов</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/projects/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить категорию проектов
                    </Link>
                </div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
}