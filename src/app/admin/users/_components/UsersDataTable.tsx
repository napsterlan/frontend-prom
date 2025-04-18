'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteProjectById, deleteUserById } from '@/api';
import { IProject, IUser } from '@/types';
import Image from 'next/image';

interface IUsersDataTableProps {
    initialData: IUser[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function UsersDataTable({ 
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: IUsersDataTableProps) {
    return (
        <DataTable
            data={initialData}
            columns={[
                {
                    key: 'image',
                    header: 'Фото',
                    render: (item: IUser) => (
                    <Image  
                        src={item.ImageURL || '/placeholder.png'}
                        alt={`${item.FirstName} ${item.LastName}`}
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
                    key: 'FirstName',
                    header: 'Имя',
                    align: 'center'
                },
                {
                    key: 'LastName',
                    header: 'Фамилия',
                    align: 'center'
                },
                {
                    key: 'Email',
                    header: 'Email',
                    align: 'center'
                }               
            ]}
            actions={[
            {
                label: 'Редактировать',
                icon: '/icon/action/link.svg',
                href: (item: IUser) => `/admin/users/${item.ID}`,
            },
            {
                label: 'Удалить',
                variant: 'destructive',
                icon: '/icon/action/delete.svg',
                showConfirm: true,
                confirmMessage: 'Вы уверены, что хотите удалить этого пользователя?',
                onClick: (item: IUser) => deleteUserById(item?.ID || 0),
                successMessage: 'Пользователь успешно удален',
                errorMessage: 'Ошибка при удалении пользователя'
            }
            ]}
            baseUrl="/admin/users"
            idField="ID"
            pathField="ID"
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
        />
    );
} 