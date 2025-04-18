'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteProjectCategoryById } from '@/api';
import { IProject } from '@/types';
import Image from 'next/image';
interface IProjectCategoriesDataTableProps {
    initialData: IProject[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function ProjectCategoriesDataTable({
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: IProjectCategoriesDataTableProps) {
    console.log('initialData: ', initialData);
    return (
        <DataTable
        data={initialData}
        columns={[
          {
            key: 'image',
            header: 'Фото',
            width: '100px',
            render: (item: IProject) => (
              <Image 
                src={item.Images?.[0]?.ImageURL || '/placeholder.png'}
                alt={item.Images?.[0]?.AltText || 'Заглушка'}
                width={64}
                height={64}
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
          {
            key: 'Order',
            header: 'Порядок',
            align: 'center'
          }
        ]}
        actions={[
          {
            label: 'Редактировать',
            href: (item: IProject) => `/admin/project-catalog/${item.Slug}`
          },
          {
            label: 'Удалить',
            variant: 'destructive',
            showConfirm: true,
            confirmMessage: 'Вы уверены, что хотите удалить этот проект?',
            onClick: (item: IProject) => deleteProjectCategoryById(item?.ID || 0)
          }
        ]}
        baseUrl="/admin/project-catalog"
        idField="ID"
        pathField="Slug"
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
      />
    );
} 