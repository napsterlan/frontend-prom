'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteNewsById } from '@/api';
import { INews } from '@/types/newsTypes';

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
            initialData={initialData}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onDelete={deleteNewsById}
        />
    );
} 