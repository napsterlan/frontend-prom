import { getUserById } from '@/api';
import { Metadata } from 'next';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
import { CompaniesForm } from '../_components/CompaniesForm';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function AddUserPage({ params, searchParams }: NextPageProps) {
    const company = {
        ID: 0,
        Name: '',
        INN: '',
        KPP: '',
        LegalAddress: '',
        Users: [],
        Addresses: [],
        FullName: '',
        Status: false,
    };

    return (
        <BreadcrumbsWrapper pageName="Добавление пользователя">
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Добавление пользователя</h1>
            <CompaniesForm 
                company={company} 
                isEditing={false}
            />
        </div>
        </BreadcrumbsWrapper>
    );
} 