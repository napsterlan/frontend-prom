'use client';

import { IProject, IProjectCategory, ICategory, IUser, IImages } from '@/types';
import { createProject, updateProjectById, getManagersList } from '@/api';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { LexicalEditor } from '@/app/_components/LexicalEditor/LexicalEditor';
import { debounce } from 'lodash';
import { SortableImage } from '../../_components/SortableImage';
import { uploadImages } from '@/api';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { toSlug } from '@/utils/transliterate';
import { ProjectMainInfo } from './ProjectMainInfo';

registerLocale('ru', ru);
setDefaultLocale('ru');

const MAX_IMAGES = 20;

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
        const descriptionJson = JSON.parse(formData.description || '{}');
        const isEmpty = descriptionJson.root?.children?.every?.(
            (node: any) => 
                node.type === 'paragraph' && 
                (!node.children || node.children.length === 0)
        );
        
        if (!formData.description || isEmpty) {
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
}

interface IProjectFormData extends IProject {
    ExistingImages: {
        ID?: number | null;
        ImageURL: string;
        AltText: string;
        Order: number;
        ShortURL?: string;
        file?: File;
        isNew?: boolean;
    }[] | [];
    CategoriesID: number[];
    DeletedImages: number[] | [],
}

type TabType = 'main' | 'relations';

export function ProjectForm({ project, projectCategories, productCategories, isEditing }: IProjectFormProps) {
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
        Slug: project.Slug || '',
        Images: [],
        ExistingImages: project.Images?.length ? project.Images.map((img, index) => ({
            ...img,
            Order: typeof img.Order === 'number' ? img.Order : index,
            ID: img.ID || null,
            ImageURL: img.ImageURL || '',
            AltText: img.AltText || '',
            ShortURL: img.ShortURL || '',
        }))
        .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)) : [],
        DeletedImages: [],
        Status: project.Status || false,
        PublishDate: project.PublishDate || '',
        UserID: project.User?.ID || null,
    });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditing ? true : false);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        
        if (formData.ExistingImages.length + newFiles.length > MAX_IMAGES) {
            alert(`Максимальное количество изображений: ${MAX_IMAGES}`);
            return;
        }

        const newPreviewImages = newFiles.map((file, index) => ({
            ImageURL: URL.createObjectURL(file),
            AltText: '',
            Order: formData.ExistingImages.length + index,
            isNew: true,
            file: file
        }));

        setFormData(prev => ({
            ...prev,
            ExistingImages: [...prev.ExistingImages, ...newPreviewImages],
        }));
    };

    const handleUploadImages = async () => {
        const processedImages = await Promise.all(
            formData.ExistingImages.map(async (image) => {
                if (!image.isNew) {
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
    
        setFormData(prev => ({
            ...prev,
            Images: {
                ...prev.Images,
                ...processedImages
            },
            ExistingImages: prev.ExistingImages.map((img, index) => ({
                ...img,
                Order: index
            }))
        }));
        
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
                .filter(img => !img.isNew)
                .map((img, index) => ({
                    ID: img.ID,
                    ImageURL: img.ShortURL || img.ImageURL,
                    Order: index
                }));
            const newImages = await handleUploadImages();
            
            const allImages = [...ExistingImagesData, ...newImages.filter(img => !img.ID)];
            if (isEditing && formData.ID) {
                await updateProjectById(formData.ID, {
                    ...formData,
                    Images: allImages,
                    MainCategoryID: formData.CategoriesID[0]
                })
                .then((res) => {
                    // window.location.href = `${res.data.Slug}`
                    router.push(res.data.Slug)
                    // router.refresh();
                });
            } else {
                await createProject({
                    ...formData,
                    Images: allImages,
                    MainCategoryID: formData.CategoriesID[0]
                })
                .then((res) => {
                    // window.location.href = `${res.data.Slug}`
                    router.push(res.data.Slug)
                    // router.refresh();
                });
            }

            showToast('Проект успешно сохранен', 'success');
            setLoading(false);
        } catch (error) {
            showToast('Ошибка при сохранении проекта', 'error');
            setLoading(false);
        }
    };

    const handleImageDelete = (index: number) => {
        const imageToDelete = formData.ExistingImages[index];
        
        setFormData(prev => {
            const newExistingImages = prev.ExistingImages.filter((_, i) => i !== index);
            
            if (imageToDelete.ID) {
                return {
                    ...prev,
                    ExistingImages: newExistingImages,
                    DeletedImages: [...prev.DeletedImages, imageToDelete.ID]
                };
            }
            
            return { ...prev, ExistingImages: newExistingImages };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setFormData(prev => {
            const oldIndex = prev.ExistingImages.findIndex((img, i) => 
                `${img.ID || img.ImageURL}-${i}` === active.id
            );
            const newIndex = prev.ExistingImages.findIndex((img, i) => 
                `${img.ID || img.ImageURL}-${i}` === over.id
            );

            // Получаем новый порядок изображений
            const reorderedImages = arrayMove(prev.ExistingImages, oldIndex, newIndex);

            console.log('reorderedImages', reorderedImages);
            // Обновляем порядок
            const updatedImages = reorderedImages.map((img, i) => ({
                ...img,
                Order: i
            }));

            return {
                ...prev,
                ExistingImages: updatedImages
            };
        });
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

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 4,
          tolerance: 3,
          delay: 0
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    // Create a debounced version of the state update 
    const debouncedSetFormData = useCallback(
        debounce((content: string) => {
            setFormData(prev => ({
                ...prev,
                description: content
            }));
        }, 1000), // 1 second delay
        []
    );

    const handleEditorChange = useCallback((content: string) => {
        debouncedSetFormData(content);
    }, [debouncedSetFormData]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState<IProjectCategory[]>(projectCategories);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setFilteredCategories(projectCategories);
    }, [projectCategories]);

    const handleCategorySearch = (searchValue: string) => {
        const filtered = projectCategories.filter(cat => 
            cat.Name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredCategories(filtered);
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
                    Сохранить проект
                </button>
            </div>

            {activeTab === 'main' && (
                <>
                    {/* Верхний блок с двумя колонками */}
                    <div className="flex gap-6 mb-6">
                        {/* Левая колонка - изображения */}
                        <div className="w-1/2">
                            <div className="mb-4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    accept="image/*"
                                    disabled={formData.ExistingImages.length >= MAX_IMAGES}
                                />
                                <label 
                                    htmlFor="file-upload" 
                                    className={`inline-block px-4 py-2 rounded-md cursor-pointer ${
                                        formData.ExistingImages.length >= MAX_IMAGES 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {formData.ExistingImages.length >= MAX_IMAGES 
                                        ? 'Достигнут лимит изображений' 
                                        : 'Добавить изображения'
                                    }
                                </label>
                                <div className="text-sm text-gray-500 mt-2">
                                    {`${formData.ExistingImages.length}/${MAX_IMAGES} изображений`}
                                </div>
                                {errors.Images && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Images}</p>
                                )}

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={formData.ExistingImages.map((image, index) => `${image.ID || image.ImageURL}-${index}`)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-4 mt-4">
                                            {formData.ExistingImages.map((image, index) => (
                                                <SortableImage
                                                    key={`${image.ID || image.ImageURL}-${index}`}
                                                    image={image}
                                                    index={index}
                                                    onDelete={() => handleImageDelete(index)}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>

                        {/* Правая колонка - основная информация */}
                        <div className="w-1/2">
                            <ProjectMainInfo
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
                    <div className="w-full mb-6">
                        <h2 className="text-2xl font-bold mb-4">Описание проекта</h2>
                        <div className={`w-full ${errors.Description ? 'border-2 border-red-500 rounded-md' : ''}`}>
                            <LexicalEditor
                                initialContent={project.Description || ''}
                                onChange={(content) => {
                                    handleEditorChange(content);
                                    if (errors.Description) {
                                        setErrors({ ...errors, Description: undefined });
                                    }
                                }}
                                className="prose max-w-none"
                            />
                        </div>
                        {errors.Description && (
                            <p className="text-red-500 text-sm mt-1">{errors.Description}</p>
                        )}
                    </div>
                </>
            )}

            {/* Связи */}
            {activeTab === 'relations' && (
                <div className="space-y-6">
                    <div>
                        <div>
                            <label className="block mb-2">Показывать в категориях</label>
                            
                            {/* Выбранные категории (чипы) */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.CategoriesID.map((id, index) => {
                                    const category = projectCategories.find(cat => cat.ID === id);

                                    if (!category) return null;
                                    
                                    const isMainCategory = index === 0; // Первая(нулевая) категория всегда главная
                                    
                                    return (
                                        <div
                                            key={id}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                                                isMainCategory 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                            title={isMainCategory ? "Главная категория" : ""}
                                        >
                                            <span>{category.Name}</span>
                                            <button
                                                type="button"
                                                className={`ml-1 hover:text-red-800 ${
                                                    isMainCategory ? 'text-green-600' : 'text-blue-600'
                                                }`}
                                                onClick={() => {
                                                    const newCategories = formData.CategoriesID.filter(
                                                        (catId) => catId !== id
                                                    );
                                                    
                                                    setFormData({ 
                                                        ...formData, 
                                                        CategoriesID: newCategories,
                                                    });
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.ProjectsCategories && (
                                <p className="text-red-500 text-sm mb-2">{errors.ProjectsCategories}</p>
                            )}

                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors.ProjectsCategories ? 'border-red-500' : ''}`}
                                    placeholder="Поиск категорий..."
                                    onChange={(e) => {
                                        handleCategorySearch(e.target.value);
                                        if (errors.ProjectsCategories) {
                                            setErrors({ ...errors, ProjectsCategories: undefined });
                                        }
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                
                                {/* Выпадающий список */}
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                                        {filteredCategories?.map((category) => (
                                            <div
                                                key={category.ID}
                                                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                                    formData.CategoriesID.includes(category.ID) 
                                                        ? formData.CategoriesID[0] === category.ID 
                                                            ? 'bg-green-50' 
                                                            : 'bg-blue-50' 
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    const isSelected = formData.CategoriesID.includes(category.ID);
                                                    let newCategories;
                                                    
                                                    if (isSelected) {
                                                        // Удаляем категорию
                                                        newCategories = formData.CategoriesID.filter((id) => id !== category.ID);
                                                    } else {
                                                        // Добавляем категорию
                                                        newCategories = [...formData.CategoriesID, category.ID];
                                                    }
                                                    
                                                    setFormData({ 
                                                        ...formData, 
                                                        CategoriesID: newCategories,
                                                    });
                                                }}
                                            >
                                                {category.Name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}