'use client';

import { DataTable } from './data-table';
import { deleteProjectById } from '@/api/apiClient';
import { Project } from '@/types/project';

interface ProjectsDataTableProps {
    initialData: Project[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function ProjectsDataTable({ 
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: ProjectsDataTableProps) {
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