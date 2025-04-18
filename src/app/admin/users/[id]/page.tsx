import { getUserById } from '@/api';
import { Metadata } from 'next';
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';
import { UserForm } from '../_components/UserForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { ICompany } from '@/types/userTypes';
export const metadata: Metadata = {
    title: 'Редактирование проекта',
    description: 'Редактирование существующего проекта',
};

export default async function EditProjectPage({ params, searchParams }: NextPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions) 
    if (!id) {
        console.log('not found 404'); 
        return;
    }

    try {
        const user = await getUserById(id, session?.jwt);

        if (!user) {
            return {
                notFound: true,
            };
        }

        return (
            <BreadcrumbsWrapper pageName={`Редактирование пользователя: ${user.data.FirstName} ${user.data.LastName}`}>
                <UserForm 
                    user={user.data} 
                    isEditing={true}
                    maxImages={1}
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