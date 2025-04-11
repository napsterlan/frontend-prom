'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteProjectById } from '@/api';
import { IProject } from '@/types';

interface IProjectsDataTableProps {
    initialData: IProject[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function ProjectsDataTable({ 
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: IProjectsDataTableProps) {
    return (
        <DataTable 
            initialData={initialData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onDelete={deleteProjectById}
        />
    );
} 