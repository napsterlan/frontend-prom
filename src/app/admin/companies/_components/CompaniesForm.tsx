'use client';

import {  IImages, INews, IUser } from '@/types';
import { createCompany, createUser, updateCompany, updateUserById, uploadImages } from '@/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { FormImageGallery } from '../../_components/form/FormImageGallery';
import { FormCompany } from '../../_components/form/FormCompany';
import { ICompany } from '@/types/userTypes';

interface IValidationErrors {
    Title?: string;
    Name?: string;
    Description?: string;
    UserID?: string;
    PublishDate?: string;
    Images?: string;
    ProjectsCategories?: string;
}

function validateProject(formData: typeof CompaniesForm.prototype.formData): IValidationErrors {
    const errors: IValidationErrors = {};

    // if (!formData.Title) {
    //     errors.Title = 'Заголовок обязателен';
    // } else if (formData.Title.length > 255) {
    //     errors.Title = 'Заголовок должен быть меньше 255 символов';
    // }

    // if (!formData.Name) {
    //     errors.Name = 'Название обязательно';
    // } else if (formData.Name.length > 255) {
    //     errors.Name = 'Название должно быть меньше 255 символов';
    // }

    // // Проверка пустого описания в формате Lexical Editor
    // try {
    //     const descriptionJson = JSON.parse(formData.Description || '{}');
    //     const isEmpty = descriptionJson.root?.children?.every?.(
    //         (node: any) => 
    //             node.type === 'paragraph' && 
    //             (!node.children || node.children.length === 0)
    //     );
        
    //     if (!formData.Description || isEmpty) {
    //         errors.Description = 'Описание обязательно';
    //     }
    // } catch (e) {
    //     // Если не удалось распарсить JSON, считаем описание пустым
    //     errors.Description = 'Описание обязательно';
    // }

    // if (!formData.UserID) {
    //     errors.UserID = 'Пользователь обязателен';
    // }

    // if (!formData.PublishDate) {
    //     errors.PublishDate = 'Дата публикации обязательна';
    // }

    // if (!formData.CategoriesID.length) {
    //     errors.ProjectsCategories = 'Как минимум одна категория обязательна';
    // }

    return errors;
}

interface IProjectFormProps {
    company: ICompany;
    isEditing: boolean;
}

export function CompaniesForm({ company, isEditing}: IProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [errors, setErrors] = useState<IValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ICompany>({
        ID: company.ID,
        Name: company.Name || '',
        INN: company.INN || '',
        KPP: company.KPP || '',
        LegalAddress: company.LegalAddress || '',
        Users: company.Users || [],
        Addresses: company.Addresses || [],
        FullName: company.FullName || '',
        Status: company.Status,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateProject(formData);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            if (isEditing && formData.ID) {
                await updateCompany(formData.ID, {
                    ID: formData.ID,
                    Name: formData.Name || '',
                    INN: formData.INN || '',
                    KPP: formData.KPP || '',
                    LegalAddress: formData.LegalAddress || '',
                    Users: formData.Users || [],
                    Addresses: formData.Addresses || [],
                    FullName: formData.FullName || '',
                    Status: formData.Status,
                })
                .then(() => {
                    router.refresh();
                });
            } else {
                console.log('formData', formData);
                await createCompany(formData)
                .then(() => {
                    router.refresh();
                });
            }

            showToast('Пользователь успешно сохранен', 'success');
            setLoading(false);      
        } catch (error) {
            showToast('Ошибка при сохранении пользователя', 'error');
            setLoading(false);
        }
    };

    return(
        <div>опа опа опапа</div>
    );
}