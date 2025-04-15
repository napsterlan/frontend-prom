'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteProjectCategoryById } from '@/api';
import { IProject } from '@/types';

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
            initialData={initialData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onDelete={deleteProjectCategoryById}
        />
    );
} 