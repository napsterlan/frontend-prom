import { getUserById } from '@/api';
import { Metadata } from 'next';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
import { UserForm } from '../_components/UserForm';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function AddUserPage({ params, searchParams }: NextPageProps) {
    const user = {
        ID: 0,
        Username: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Role: 'client',
        PartnerLevel: 0,
        Phone: '',
        Status: false,
        Company: [],
    };

    return (
        <BreadcrumbsWrapper pageName="Добавление пользователя">
            <UserForm 
                user={user} 
                isEditing={false}
                maxImages={1}
            />
        </BreadcrumbsWrapper>
    );
} 