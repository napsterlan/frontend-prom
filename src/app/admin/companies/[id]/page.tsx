import { getCompanyById, getUserById } from '@/api';
import { Metadata } from 'next';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
import { CompaniesForm } from '../_components/CompaniesForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function EditCompanyPage({ params, searchParams }: NextPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions) 
    if (!id) {
        console.log('not found 404'); 
        return;
    }

    try {
        const company = await getCompanyById({id: id, sessionToken: session?.jwt || ''});

        if (!company) {
            return {
                notFound: true,
            };
        }

        return (
            <BreadcrumbsWrapper pageName={`Редактирование компании: ${company.data.Name}`}>
                <CompaniesForm 
                    company={company.data} 
                    isEditing={true}
                />
            </BreadcrumbsWrapper>
        );
    } catch (error) {
        console.error('Error fetching project:', error);
        return {
            notFound: true,
        };
    }
} 