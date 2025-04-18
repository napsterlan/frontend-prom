'use client';

import { IProject, IProjectCategory, ICategory, IUser, ICategoryTreeById } from '@/types';
import { createProject, updateProjectById, getManagersList, uploadImages, getCategoryTreeById } from '@/api';
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

function validateProject(formData: typeof ProjectForm.prototype.formData): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!formData.Title) {
        errors.Title = 'Заголовок обязателен';
    } else if (formData.Title.length > 255) {
        errors.Title = 'Заголовок должен быть меньше 255 символов';
    }

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

    if (!formData.UserID) {
        errors.UserID = 'Пользователь обязателен';
    }

    if (!formData.PublishDate) {
        errors.PublishDate = 'Дата публикации обязательна';
    }

    if (!formData.ExistingImages.length) {
        errors.Images = 'Как минимум одно изображение обязательно';
    }

    if (!formData.CategoriesID.length) {
        errors.ProjectsCategories = 'Как минимум одна категория обязательна';
    }

    return errors;
}

interface IProjectFormProps {
    project: IProject;
    projectCategories: IProjectCategory[];
    productCategories: ICategory[];
    isEditing: boolean;
    maxImages?: number;
}

interface IProjectFormData extends IProject {
    ExistingImages: {
        ID?: number | null;
        ImageURL: string;
        AltText: string;
        Order: number;
        ShortURL?: string;
        file?: File;
        IsNew?: boolean;
    }[] | [];
    CategoriesID: number[];
    DeletedImages: number[] | [];
}

type TabType = 'main' | 'relations';

export function ProjectForm({ project, projectCategories, productCategories, isEditing, maxImages = 20 }: IProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [errors, setErrors] = useState<IValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState<IUser[]>([]);
    const [formData, setFormData] = useState<IProjectFormData>({
        ID: project.ID ?? null,
        Title: project.Title || '',
        Name: project.Name || '',
        Description: project.Description || '',
        MetaTitle: project.MetaTitle || '',
        MetaDescription: project.MetaDescription || '',
        MetaKeyword: project.MetaKeyword || '',
        CategoriesID: project.ProjectsCategories?.map((cat) => cat.ID) || [],
        MainCategoryID: project.MainCategoryID || null,
        ProjectsCategories: project.ProjectsCategories || [],
        Slug: project.Slug || '',
        Images: [],
        ExistingImages: project.Images?.length ? project.Images.map((img, index) => ({
            ...img,
            Order: typeof img.Order === 'number' ? img.Order : index,
            ID: img.ID || null,
            ImageURL: img.ImageURL || '',
            AltText: img.AltText || '',
            ShortURL: img.ShortURL || '',
        })).sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)) : [],
        RelatedProductCategories: project.RelatedProductCategories || [],
        ProjectInProductCategoriesToShow: project.ProjectInProductCategoriesToShow || [],
        DeletedImages: [],
        Status: project.Status || false,
        PublishDate: project.PublishDate || '',
        UserID: project.User?.ID || null,
    });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditing ? true : false);
    const [editorContent, setEditorContent] = useState(project.Description || '');

    useEffect(() => {
        if (isAutoSlug && formData.Title) {
            setFormData(prev => ({
                ...prev,
                Slug: toSlug(formData.Title)
            }));
        }
    }, [formData.Title, isAutoSlug]);

    const [relatedProductCategories, setRelatedProductCategories] = useState<ICategoryTreeById[]>();
    const [categoriesToShow, setCategoriesToShow] = useState<ICategoryTreeById[]>();


    useEffect(() => {
        if (project.RelatedProductCategories?.length) {
            const fetchRelatedProductCategories = async () => {
                // Сначала преобразуем в правильный формат
                const initialCategories = project.RelatedProductCategories.map(category => ({
                    ID: typeof category === 'number' ? category : category.ID,
                    Name: typeof category === 'number' ? String(category) : category.Name
                }));
                
                // Устанавливаем начальное состояние
                setRelatedProductCategories(initialCategories);
                
                // Затем делаем запрос для получения полных данных
                const fullCategories = await Promise.all(
                    initialCategories.map(async (category) => {
                        const response = await getCategoryTreeById(category.ID);
                        return response.data;
                    })
                );
                
                // Обновляем состояние полными данными
                setRelatedProductCategories(fullCategories);
            };
    
            fetchRelatedProductCategories();
        }
    }, [project.RelatedProductCategories]);

    useEffect(() => {
        if (project.ProjectInProductCategoriesToShow && project.ProjectInProductCategoriesToShow.length) {
            const fetchRelatedProductCategories = async () => {
                // Сначала преобразуем в правильный формат
                const initialCategories = project.ProjectInProductCategoriesToShow.map(category => ({
                    ID: typeof category === 'number' ? category : category.ID,
                    Name: typeof category === 'number' ? String(category) : category.Name
                }));
                
                // Устанавливаем начальное состояние
                setCategoriesToShow(initialCategories);
                
                // Затем делаем запрос для получения полных данных
                const fullCategories = await Promise.all(
                    initialCategories.map(async (category) => {
                        const response = await getCategoryTreeById(category.ID);
                        return response.data;
                    })
                );
                
                // Обновляем состояние полными данными
                setCategoriesToShow(fullCategories);
            };
    
            fetchRelatedProductCategories();
        }
    }, [project.ProjectInProductCategoriesToShow]);


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
                    const paths = await uploadImages([image.file], `catalog/projects/${project.ID}`);
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
                await updateProjectById(formData.ID, {
                    ID: formData.ID,
                    Title: formData.Title,
                    Name: formData.Name,
                    Description: formData.Description,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    ProjectsCategories: formData.CategoriesID,
                    MainCategoryID: formData.CategoriesID[0],
                    Slug: formData.Slug,
                    Images: allImages,
                    RelatedProductCategories: relatedProductCategories?.map(category => category.ID) || [],
                    ProjectInProductCategoriesToShow: categoriesToShow?.map(category => category.ID) || [],
                    DeletedImages: formData.DeletedImages,
                    Status: formData.Status,
                    PublishDate: formData.PublishDate,
                    UserID: formData.User?.ID,
                })
                .then((res) => {
                    router.push(res.data.Slug)
                });
            } else {
                console.log('formData', formData);
                await createProject({
                    ID: formData.ID,
                    Title: formData.Title,
                    Name: formData.Name,
                    Description: formData.Description,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    ProjectsCategories: formData.CategoriesID,
                    MainCategoryID: formData.CategoriesID[0],
                    Slug: formData.Slug,
                    Images: allImages,
                    RelatedProductCategories: relatedProductCategories?.map(category => category.ID) || [],
                    ProjectInProductCategoriesToShow: categoriesToShow?.map(category => category.ID) || [],
                    DeletedImages: formData.DeletedImages,
                    Status: formData.Status,
                    PublishDate: formData.PublishDate,
                    UserID: formData.UserID,
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

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await getManagersList();
                if (Array.isArray(response?.data)) {
                    setManagers(response.data);
                } else if (Array.isArray(response)) {
                    setManagers(response);
                } else {
                    console.error('Unexpected managers data format:', response);
                    showToast('Ошибка формата данных менеджеров', 'error');
                }
            } catch (error) {
                console.error('Ошибка при загрузке списка менеджеров:', error);
                showToast('Ошибка при загрузке списка менеджеров', 'error');
            }
        };
        fetchManagers();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="relative">
            {loading && <Preloader fullScreen />}
            
            {/* Верхняя панель с кнопкой сохранения */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-4 border-b">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('main')}
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'main'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Основная информация
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('relations')}
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'relations'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Связи
                    </button>
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                    Сохранить проект
                </button>
            </div>

            {activeTab === 'main' && (
                <>
                    {/* Верхний блок с двумя колонками */}
                    <div className="flex gap-6 mb-6">
                        {/* Левая колонка - изображения */}
                        <div className="w-1/2">
                            <FormImageGallery
                                existingImages={formData.ExistingImages}
                                onImagesChange={(images) => setFormData(prev => ({ ...prev, ExistingImages: images }))}
                                onDeleteImages={(deletedIds) => setFormData(prev => ({ ...prev, DeletedImages: deletedIds }))}
                                maxImages={maxImages}
                                errors={errors}
                                imagesRow={4}
                            />
                        </div>

                        {/* Правая колонка - основная информация */}
                        <div className="w-1/2">
                            <FormMainInfo
                                type="project"
                                formData={formData}
                                errors={errors}
                                managers={managers}
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
                </>
            )}

            {/* Связи */}
            {activeTab === 'relations' && (
                <>
                    {/* Связь с категориями проектов */}
                    <FormProjectCategoriesRelations
                        projectCategories={projectCategories || []}
                        productCategories={productCategories || []}
                        selectedProjectCategories={formData.CategoriesID}
                        onCategoriesChange={(categories) => {
                            setFormData(prev => ({ ...prev, CategoriesID: categories }));
                            if (errors.ProjectsCategories) {
                                setErrors({ ...errors, ProjectsCategories: undefined });
                            }
                        }}
                        error={errors.ProjectsCategories}
                    />
                    <FormRelations 
                        categories={relatedProductCategories || []}
                        setCategories={setRelatedProductCategories}
                        label="В каких категориях показывать портфолио"
                    />
                    <FormRelations 
                        categories={categoriesToShow || []}
                        setCategories={setCategoriesToShow}
                        label="Какие категории показывать в портфолио"
                    />
                </>
            )}
        </form>
    );
}































