import { getUserById } from '@/api';
import { Metadata } from 'next';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
import { CompaniesForm } from '../_components/CompaniesForm';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function AddCompanyPage({ params, searchParams }: NextPageProps) {
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
        <BreadcrumbsWrapper pageName="Добавление компании">
            <CompaniesForm 
                company={company} 
                isEditing={false}
            />
        </BreadcrumbsWrapper>
    );
} 