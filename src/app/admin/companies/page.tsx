import { getAllCompanies } from '@/api';
import { CompaniesDataTable } from './_components/CompaniesDataTable';
import Link from 'next/link';
import { Metadata } from 'next';
import { ICompany, NextPageProps } from '@/types';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Управление проектами',
    description: 'Административная панель управления проектами',
};

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ConpaniesPage({params, searchParams}: NextPageProps) {
    const { page } = await searchParams;
    const session = await getServerSession(authOptions) 
    let companies = [];
    let error = null;
    const currentPage = Number(page) || 1;

    try {
        const response = await getAllCompanies({sessionToken: session?.jwt, page: currentPage});

        companies = response.data.map((company: ICompany) => ({
            ...company,
            FullName: `
                ${company.Name || ''} 
                ${company.INN ? " / ИНН:" + company.INN : ''} 
                ${company.KPP ? " / КПП:" + company.KPP : ''} 
                ${company.LegalAddress ? " / Юр.адрес: " + company.LegalAddress : ''}
                ${company.Addresses?.[0]?.Address ? " / Физ.адрес: " + company.Addresses[0].Address : ''}
            `.trim()
        }));
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Компании</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/companies/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить Компанию
                    </Link>
                </div>
                <CompaniesDataTable 
                    initialData={companies} 
                    currentPage={currentPage}
                    totalPages={response.metadata.last_page}
                    totalRecords={response.metadata.total_records}
                />
            </div>
        );
    } catch (err) {
        error = 'Ошибка при загрузке данных компаний';
        console.error('Error fetching companies:', err);
        
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Компании</h1>
                <div className="flex space-x-2 mb-4">
                    <Link 
                        href="/admin"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </Link>
                    <Link 
                        href="/admin/companies/add" 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        + Добавить Компанию
                    </Link>
                </div>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
}