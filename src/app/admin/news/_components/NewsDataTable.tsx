'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteNewsById, deleteProjectById } from '@/api';
import { INews } from '@/types/newsTypes';
import { IProject } from '@/types/projectTypes';
import Image from 'next/image';
interface INewsDataTableProps {
    initialData: INews[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function NewsDataTable({ 
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: INewsDataTableProps) {
    return (
        <DataTable
            data={initialData}
            columns={[
            {
                key: 'image',
                header: 'Фото',
                width: '100px',
                render: (item: INews) => (
                <Image 
                    src={item.Images?.[0]?.ImageURL || '/placeholder.png'}
                    alt={item.Images?.[0]?.AltText || 'Заглушка'}
                    width={86}
                    height={86}
                    className="object-cover"
                    onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                    }}
                />
                )
            },
            {
                key: 'Name',
                header: 'Название'
            },
            ]}
            actions={[
            {
                label: 'Редактировать',
                href: (item: INews) => `/admin/news/${item.Slug}`,
            },
            {
                label: 'Удалить',
                variant: 'destructive',
                showConfirm: true,
                confirmMessage: 'Вы уверены, что хотите удалить этот проект?',
                onClick: (item: INews) => deleteNewsById(item?.ID || 0),
                successMessage: 'Проект успешно удален',
                errorMessage: 'Ошибка при удалении проекта'
            }
            ]}
            baseUrl="/admin/news"
            idField="ID"
            pathField="Slug"
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
        />
    );
} 