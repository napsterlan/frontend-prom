'use client';

import { INews, IImages, ICategory, ICategoryTreeById } from '@/types';
import { createNews, getCategoryTreeById, updateNews, uploadImages } from '@/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { toSlug } from '@/utils/transliterate';
import { FormMainInfo } from '../../_components/form/FormMainInfo';
import { FormImageGallery } from '../../_components/form/FormImageGallery';
import { FormEditor } from '../../_components/form/FormEditor';
import { FormRelations } from '../../_components/form/FormRelations';

interface IValidationErrors {
    Title?: string;
    Name?: string;
    Description?: string;
    UserID?: string;
    PublishDate?: string;
    Images?: string;
}

function validateProject(formData: typeof NewsForm.prototype.formData): IValidationErrors {
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

    if (!formData.PublishDate) {
        errors.PublishDate = 'Дата публикации обязательна';
    }

    if (!formData.ExistingImages.length) {
        errors.Images = 'Как минимум одно изображение обязательно';
    }

    return errors;
}

interface INewsFormProps {
    news: INews;
    isEditing: boolean;
    maxImages?: number;
}

interface INewsFormData extends Omit<INews, 'Images'> {
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
    Images?: IImages[] | [];
}

type TabType = 'main' | 'relations';

export function NewsForm({ news, isEditing, maxImages = 20 }: INewsFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [errors, setErrors] = useState<IValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<INewsFormData>({
        ID: news.ID ?? null,
        Title: news.Title || '',
        Name: news.Name || '',
        Description: news.Description || '',
        MetaTitle: news.MetaTitle || '',
        MetaDescription: news.MetaDescription || '',
        MetaKeyword: news.MetaKeyword || '',
        Slug: news.Slug || '',
        RelatedProductCategories: news.RelatedProductCategories || [],
        NewsInProductCategoriesToShow: news.NewsInProductCategoriesToShow || [],
        Images: [],
        ExistingImages: news.Images?.length ? news.Images.map((img, index) => ({
            ...img,
            Order: typeof img.Order === 'number' ? img.Order : index,
            ID: img.ID || null,
            ImageURL: img.ImageURL || '',
            AltText: img.AltText || '',
            ShortURL: img.ShortURL || '',
        }))
        .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)) : [],
        DeletedImages: [],
        Status: news.Status || false,
        PublishDate: news.PublishDate || '',
    });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditing ? true : false);
    const [editorContent, setEditorContent] = useState(news.Description || '');

    const [relatedProductCategories, setRelatedProductCategories] = useState<ICategoryTreeById[]>(); // В каких категориях показывать новость
    const [categoriesToShow, setCategoriesToShow] = useState<ICategoryTreeById[]>(); // Какие категории показывать в новости
    // мапим с бека в юзэффекте
    useEffect(() => {
        if (news.RelatedProductCategories?.length) {
            const fetchRelatedProductCategories = async () => {
                // Сначала преобразуем в правильный формат
                const initialCategories = news.RelatedProductCategories.map(category => ({
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
    }, [news.RelatedProductCategories]);

    useEffect(() => {
        if (news.NewsInProductCategoriesToShow?.length) {
            const fetchRelatedProductCategories = async () => {
                // Сначала преобразуем в правильный формат
                const initialCategories = news.NewsInProductCategoriesToShow.map(category => ({
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
    }, [news.NewsInProductCategoriesToShow]);

    useEffect(() => {
        if (isAutoSlug && formData.Title) {
            setFormData(prev => ({
                ...prev,
                Slug: toSlug(formData.Title)
            }));
        }
    }, [formData.Title, isAutoSlug]);

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
                    const paths = await uploadImages([image.file], `catalog/news/${news.ID}`);
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
        
        console.log('validationErrors', validationErrors);
        
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
                await updateNews(formData.ID, {
                    ID: formData.ID,
                    Title: formData.Title,
                    Name: formData.Name,
                    Description: formData.Description,
                    PublishDate: formData.PublishDate,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    Slug: formData.Slug,
                    Status: formData.Status,
                    RelatedProductCategories: relatedProductCategories?.map(category => category.ID) || [], // нужно передавать number []
                    NewsInProductCategoriesToShow: categoriesToShow?.map(category => category.ID) || [], // нужно передавать number []
                    Images: allImages,
                    FullPath: formData.FullPath,
                    DeletedImages: formData.DeletedImages,
                })
                .then((res) => {
                    router.push(res.data.Slug)
                });
            } else {
                await createNews({
                    ID: formData.ID,
                    Title: formData.Title,
                    Name: formData.Name,
                    Description: formData.Description,
                    PublishDate: formData.PublishDate,
                    MetaTitle: formData.MetaTitle,
                    MetaDescription: formData.MetaDescription,
                    MetaKeyword: formData.MetaKeyword,
                    Slug: formData.Slug,
                    Status: formData.Status,
                    RelatedProductCategories: relatedProductCategories?.map(category => category.ID) || [], // нужно передавать number []
                    NewsInProductCategoriesToShow: categoriesToShow?.map(category => category.ID) || [], // нужно передавать number []
                    Images: allImages,
                    FullPath: formData.FullPath,
                    DeletedImages: formData.DeletedImages,
                })
                .then((res) => {
                    router.push(res.data.Slug)
                });
            }

            showToast('Новость успешно сохранена', 'success');
            setLoading(false);
        } catch (error) {
            showToast('Ошибка при сохранении новости', 'error');
            setLoading(false);
        }
    };

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
                    Сохранить новость
                </button>
            </div>

            {activeTab === 'main' && (
                <>
                    {/* Верхний блок с двумя колонками */}
            <div className="flex gap-6 mb-6">
                        {/* Левая колонка - изображения */}
                <FormImageGallery
                    existingImages={formData.ExistingImages}
                    onImagesChange={(images) => setFormData(prev => ({ ...prev, ExistingImages: images }))}
                    onDeleteImages={(deletedIds) => setFormData(prev => ({ ...prev, DeletedImages: deletedIds }))}
                    maxImages={maxImages}
                    errors={errors}
                />

                        {/* Правая колонка - основная информация */}
                <div className="w-1/2">
                    <FormMainInfo
                        type="news"
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
                </>
            )}

            {/* Связи */}
            {activeTab === 'relations' && (
                <div className="space-y-8">
                    <FormRelations 
                        categories={relatedProductCategories || []}
                        setCategories={setRelatedProductCategories}
                        label="В каких категориях показывать новость"
                    />
                    <FormRelations 
                        categories={categoriesToShow || []}
                        setCategories={setCategoriesToShow}
                        label="Какие категории показывать в новости"
                    />
                </div>
            )}
        </form>
    );
}