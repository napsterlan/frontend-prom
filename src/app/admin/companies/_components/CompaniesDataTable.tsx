'use client';

import { DataTable } from '@/app/admin/_components/DataTable';
import { deleteCompanyById } from '@/api';
import { ICompany } from '@/types';

interface ICompaniesDataTableProps {
    initialData: ICompany[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export function CompaniesDataTable({ 
    initialData, 
    currentPage, 
    totalPages, 
    totalRecords 
}: ICompaniesDataTableProps) {

    return (
        <DataTable
            data={initialData}
            columns={[
                {
                    key: 'Name',
                    header: 'Наименование',
                    align: 'center'
                },
                {
                    key: 'INN',
                    header: 'ИНН',
                    align: 'center'
                },
                {
                    key: 'KPP',
                    header: 'КПП',
                    align: 'center'
                },
                {
                    key: 'LegalAddress',
                    header: 'Юр.адрес',
                    align: 'center'
                },
                
            ]}
            actions={[
            {
                label: 'Редактировать',
                href: (item: ICompany) => `/admin/companies/${item.ID}`,
                icon: '/icon/action/link.svg',
            },
            {
                label: 'Удалить',
                variant: 'destructive',
                showConfirm: true,
                confirmMessage: 'Вы уверены, что хотите удалить эту компанию?',
                onClick: (item: ICompany) => deleteCompanyById(item?.ID || 0),
                successMessage: 'Компания успешно удалена',
                errorMessage: 'Ошибка при удалении компании',
                icon: '/icon/action/delete.svg',
            }
            ]}
            baseUrl="/admin/companies"
            idField="ID"
            pathField="ID"
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
        />
    );
} 