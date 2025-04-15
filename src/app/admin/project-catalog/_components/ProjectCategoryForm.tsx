'use client';

import { IProjectCategory, ICategoryTreeById } from '@/types';
import { createProject, updateProjectById, getManagersList, uploadImages, getCategoryTreeById, updateProjectCategoryById, createProjectCategory } from '@/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { toSlug } from '@/utils/transliterate';
import { FormMainInfo } from '../../_components/form/FormMainInfo';
import { FormImageGallery } from '../../_components/form/FormImageGallery';
import { FormEditor } from '../../_components/form/FormEditor';
import { FormProjectCategoriesRelations } from './project-form/FormProjectCategoriesRelations';
import { FormRelations } from '../../_components/form/FormRelations';

interface IValidationErrors {
    Title?: string;
    Name?: string;
    Description?: string;
    UserID?: string;
    PublishDate?: string;
    Images?: string;
    ProjectsCategories?: string;
}

function validateProject(formData: typeof ProjectCategoryForm.prototype.formData): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!formData.Name) {
        errors.Name = 'Название обязательно';
    } else if (formData.Name.length > 255) {
        errors.Name = 'Название должно быть меньше 255 символов';
    }

    // Проверка пустого описания в формате Lexical Editor
    try {
        const descriptionJson = JSON.parse(formData.Description || '{}');
        const isEmpty = descriptionJson.root?.children?.every?.(
            (node: any) => 
                node.type === 'paragraph' && 
                (!node.children || node.children.length === 0)
        );
        
        if (!formData.Description || isEmpty) {
            errors.Description = 'Описание обязательно';
        }
    } catch (e) {
        // Если не удалось распарсить JSON, считаем описание пустым
        errors.Description = 'Описание обязательно';
    }

    return errors;
}

interface IProjectFormProps {
    projectCategories: IProjectCategory;
    isEditing: boolean;
}

interface IProjectCategoryFormData extends IProjectCategory {
    ExistingImages: {
        ID?: number | null;
        ImageURL: string;
        AltText: string;
        Order: number;
        ShortURL?: string;
        file?: File;
        IsNew?: boolean;
    }[] | [];
    DeletedImages: number[] | [];
}

export function ProjectCategoryForm({ projectCategories, isEditing }: IProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [errors, setErrors] = useState<IValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<IProjectCategoryFormData>({
        ID: projectCategories.ID || null,
        Name: projectCategories.Name || '',
        Description: projectCategories.Description || '',
        MetaTitle: projectCategories.MetaTitle || '',
        MetaDescription: projectCategories.MetaDescription || '',
        MetaKeyword: projectCategories.MetaKeyword || '',
        Slug: projectCategories.Slug || '',
        Status: projectCategories.Status || false,
        FullPath: projectCategories.FullPath || '',
        Order: projectCategories.Order || 0,
        Images: [],
        ExistingImages: projectCategories.Images?.length ? projectCategories.Images.map((img, index) => ({
            ...img,
            Order: typeof img.Order === 'number' ? img.Order : index,
            ID: img.ID || null,
            ImageURL: img.ImageURL || '',
            AltText: img.AltText || '',
            ShortURL: img.ShortURL || '',
        })).sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)) : [],    
        DeletedImages: [],
    })

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditing ? true : false);
    const [editorContent, setEditorContent] = useState(projectCategories.Description || '');

    console.log('editorContent', editorContent);

    useEffect(() => {
        if (isAutoSlug && formData.Name) {
            setFormData(prev => ({
                ...prev,
                Slug: toSlug(formData.Name)
            }));
        }
    }, [formData.Name, isAutoSlug]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAutoSlug) {
            setFormData(prev => ({
                ...prev,
                Slug: toSlug(e.target.value)
            }));
        }
    };

    const handleUploadImages = async () => {
        const processedImages = await Promise.all(
            formData.ExistingImages.map(async (image) => {
                if (!image.IsNew) {
                    return {
                        ID: image.ID,
                        ImageURL: image.ShortURL || image.ImageURL,
                        Order: image.Order
                    };
                } else if (image.file) {
                    const paths = await uploadImages([image.file], `catalog/project-catalog/${projectCategories.ID}`);
                    return {
                        ID: image.ID,
                        ImageURL: paths.filePaths[0],
                        Order: image.Order
                    };
                } else {
                    return {
                        ID: image.ID,
                        ImageURL: image.ImageURL,
                        Order: image.Order
                    };
                }
            })
        );
    
        return processedImages;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateProject(formData);

        console.log('validationErrors', validationErrors);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);
        
        try {
            const ExistingImagesData = formData.ExistingImages
                .filter(img => !img.IsNew)
                .map(img => ({
                    ID: img.ID,
                    ImageURL: img.ShortURL || img.ImageURL,
                    Order: img.Order
                }));
            const newImages = await handleUploadImages();
            
            const allImages = [...ExistingImagesData, ...newImages.filter(img => !img.ID)]
                .sort((a, b) => a.Order - b.Order);

            if (isEditing && formData.ID) {
                await updateProjectCategoryById(formData.ID, {
                    ID: formData.ID,
                    Name: formData.Name,
                    Description: formData.Description,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    Slug: formData.Slug,
                    Images: allImages,
                    DeletedImages: formData.DeletedImages,
                    Status: formData.Status,
                    Order: formData.Order || 0,
                })
                .then((res) => {
                    router.push(res.data.Slug)
                });
            } else {
                await createProjectCategory({
                    ID: formData.ID,
                    Name: formData.Name,
                    Description: formData.Description,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    Slug: formData.Slug,
                    Images: allImages,
                    DeletedImages: formData.DeletedImages,
                    Status: formData.Status,
                    Order: formData.Order || 0,
                })
                .then((res) => {
                    router.push(res.data.Slug)
                });
            }

            showToast('Проект успешно сохранен', 'success');
            setLoading(false);
        } catch (error) {
            showToast('Ошибка при сохранении проекта', 'error');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {loading && <Preloader fullScreen />}
            
            {/* Верхняя панель с кнопкой сохранения */}
            <div className="flex justify-end items-center mb-6 sticky top-0 bg-white z-10 py-4 border-b">
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                    Сохранить категорию
                </button>
            </div>
            <div>
                {/* Верхний блок с двумя колонками */}
                <div className="flex gap-6 mb-6">
                    {/* Левая колонка - изображения */}
                    <FormImageGallery
                        existingImages={formData.ExistingImages}
                        onImagesChange={(images) => setFormData(prev => ({ ...prev, ExistingImages: images }))}
                        onDeleteImages={(deletedIds) => setFormData(prev => ({ ...prev, DeletedImages: deletedIds }))}
                        maxImages={20}
                        errors={errors}
                    />

                    {/* Правая колонка - основная информация */}
                    <div className="w-1/2">
                        <FormMainInfo
                            type="projectCategory"
                            formData={formData}
                            errors={errors}
                            isAutoSlug={isAutoSlug}
                            setFormData={setFormData}
                            setErrors={setErrors}
                            setIsAutoSlug={setIsAutoSlug}
                            handleSlugChange={handleSlugChange}
                        />
                    </div>
                </div>

                {/* Блок описания на всю ширину */}
                <FormEditor
                    initialContent={editorContent}
                    onChange={(content) => {
                        setEditorContent(content);
                        setFormData(prev => ({ ...prev, Description: content }));
                    }}
                    error={errors.Description}
                />
            </div>
        </form>
    );
}