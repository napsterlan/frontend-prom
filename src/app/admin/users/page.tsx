import { getAllUsers, getCategories } from '@/api';
import { UsersDataTable } from './_components/UsersDataTable';
import Link from 'next/link';
import { Metadata } from 'next';
import { NextPageProps } from '@/types';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Управление проектами',
    description: 'Административная панель управления проектами',
};

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage({params, searchParams}: NextPageProps) {
    const { page } = await searchParams;
    const session = await getServerSession(authOptions) 
    let users = [];
    let error = null;
    const currentPage = Number(page) || 1;

    try {
        const response = await getAllUsers(currentPage, session?.jwt);
        
        console.log('Response:', response);

        users = response.data;
        console.log('users', users);
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/users/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить пользователя
                    </Link>
                </div>
                <UsersDataTable 
                    initialData={users} 
                    currentPage={currentPage}
                    totalPages={response.metadata.last_page}
                    totalRecords={response.metadata.total_records}
                />
            </div>
        );
    } catch (err) {
        error = 'Ошибка при загрузке данных пользователей';
        console.error('Error fetching users:', err);
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/users/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить пользователя
                    </Link>
                </div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
}