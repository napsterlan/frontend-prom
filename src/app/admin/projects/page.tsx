import { getAllProjects, getCategories } from '@/api';
import { ProjectsDataTable } from './_components/ProjectsDataTable';
import Link from 'next/link';
import { Metadata } from 'next';
import { NextPageProps } from '@/types';

export const metadata: Metadata = {
    title: 'Управление проектами',
    description: 'Административная панель управления проектами',
};

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage({params, searchParams}: NextPageProps) {
    const { page } = await searchParams;
    let projects = [];
    let categories = [];
    let error = null;
    const currentPage = Number(page) || 1;

    try {
        const response = await getAllProjects(currentPage, '');
        projects = response.data;
        const categoriesResponse = await getCategories();
        categories = categoriesResponse.data;
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Проекты</h1>
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
                        + Добавить проект
                    </Link>
                </div>
                <ProjectsDataTable 
                    initialData={projects} 
                    currentPage={currentPage}
                    totalPages={response.metadata.last_page}
                    totalRecords={response.metadata.total_records}
                />
            </div>
        );
    } catch (err) {
        error = 'Ошибка при загрузке данных проектов';
        console.error('Error fetching projects:', err);
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Проекты</h1>
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
                        + Добавить проект
                    </Link>
                </div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
}