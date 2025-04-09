'use client';

import { DataTable } from './DataTable';
import { deleteNewsById } from '@/api';
import { INews } from '@/types/newsTypes';

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