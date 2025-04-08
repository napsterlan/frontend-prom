'use client';

import { DataTable } from './data-table';
import { deleteNewsById } from '@/api/apiClient';
import { INews } from '@/types/news';

interface NewsDataTableProps {
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
}: NewsDataTableProps) {
    return (
        <DataTable 
            initialData={initialData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onDelete={deleteNewsById}
        />
    );
} 