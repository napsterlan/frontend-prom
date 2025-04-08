'use client';

import { Project, ProjectCategory, IProductCategory, User } from '@/types/types';
import { createProject, updateProjectById, getManagersList, getCategoryBySlug } from '@/api/apiClient';
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
import { SortableImage } from './SortableImage';
import { uploadImages } from '@/api/apiClient';
import { useToast } from '@/components/ui/ToastContext';
import { Preloader } from '@/components/ui/Preloader';
import { toSlug } from '@/utils/transliterate';
import { ProjectMainInfo } from './ProjectMainInfo';

registerLocale('ru', ru);
setDefaultLocale('ru');

const MAX_IMAGES = 20;

interface ValidationErrors {
    title?: string;
    name?: string;
    description?: string;
    userID?: string;
    publishDate?: string;
    images?: string;
    projectsCategories?: string;
}

function validateProject(formData: typeof ProjectForm.prototype.formData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.Title) {
        errors.title = 'Заголовок обязателен';
    } else if (formData.Title.length > 255) {
        errors.title = 'Заголовок должен быть меньше 255 символов';
    }

    if (!formData.Name) {
        errors.name = 'Название обязательно';
    } else if (formData.Name.length > 255) {
        errors.name = 'Название должно быть меньше 255 символов';
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
            errors.description = 'Описание обязательно';
        }
    } catch (e) {
        // Если не удалось распарсить JSON, считаем описание пустым
        errors.description = 'Описание обязательно';
    }

    if (!formData.UserID) {
        errors.userID = 'Пользователь обязателен';
    }

    if (!formData.PublishDate) {
        errors.publishDate = 'Дата публикации обязательна';
    }

    if (!formData.existingImages.length) {
        errors.images = 'Как минимум одно изображение обязательно';
    }

    if (!formData.CategoriesID.length) {
        errors.projectsCategories = 'Как минимум одна категория обязательна';
    }

    return errors;
}

interface ProjectFormProps {
    project: Project;
    projectCategories: ProjectCategory[];
    productCategories: IProductCategory[];
    isEditing: boolean;
}

type TabType = 'main' | 'relations';

export function ProjectForm({ project, projectCategories, productCategories, isEditing }: ProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('main');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState<User[]>([]);
    const [formData, setFormData] = useState<{
        ID: number;
        Title: string;
        Name: string;
        description: string;
        metaTitle: string;
        metaDescription: string;
        metaKeyword: string;
        CategoriesID: number[];
        MainCategoryID: number | null;
        Slug: string;
        Images: {
            ID?: number;
            ImageURL: string;
            Order: number;
        }[];
        relatedProducts: {
            ID: number;
            Name: string;
            Images: {
                ID: number;
                ImageURL: string;
                AltText: string;
                Order: number;
            }[];
            fullPath: string;
        }[];
        existingImages: Array<{
          ID?: number;
          ImageURL: string;
          AltText: string;
          Order: number;
          isNew?: boolean;
          file?: File;
          ShortURL?: string;
        }>;
        Status: boolean;
        deletedImages: number[];
        PublishDate: Date | null;
        UserID: number | null;
      }>({
        ID: project.ID ?? 0,
        Title: project.Title || '',
        Name: project.Name || '',
        description: project.Description || '',
        metaTitle: project.MetaTitle || '',
        metaDescription: project.MetaDescription || '',
        metaKeyword: project.MetaKeyword || '',
        CategoriesID: project.ProjectsCategories?.map((cat) => cat.ID) || [],
        MainCategoryID: project.MainCategoryID || null,
        Slug: project.Slug || '',
        Images: [],
        relatedProducts: project.RelatedProducts?.map(product => ({
          ...product,
          Images: product.Images || []
        })) || [],
        existingImages: (project.Images || [])
          .map((img, index) => ({
            ...img,
            Order: typeof img.Order === 'number' ? img.Order : index,
            ID: img.ID || undefined,
            ImageURL: img.ImageURL || '',
            ShortURL: img.ShortURL || '',
          }))
          .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)),
        Status: project.Status || false,
        deletedImages: [],
        PublishDate: project.PublishDate ? new Date(project.PublishDate) : null,
        UserID: project.User?.ID || null
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
        
        if (formData.existingImages.length + newFiles.length > MAX_IMAGES) {
            alert(`Максимальное количество изображений: ${MAX_IMAGES}`);
            return;
        }

        const newPreviewImages = newFiles.map((file, index) => ({
            ImageURL: URL.createObjectURL(file),
            AltText: '',
            Order: formData.existingImages.length + index,
            isNew: true,
            file: file
        }));

        setFormData(prev => ({
            ...prev,
            existingImages: [...prev.existingImages, ...newPreviewImages],
        }));
    };

    const handleUploadImages = async () => {
        const processedImages = await Promise.all(
            formData.existingImages.map(async (image) => {
                if (!image.isNew) {
                    return {
                        ID: image.ID,
                        ImageURL: image.ShortURL || image.ImageURL,
                        Order: image.Order
                    };
                }

                const paths = await uploadImages([image.file!], `catalog/projects/${project.ID}`);
                return {
                    ID: image.ID,
                    ImageURL: paths.filePaths[0],
                    Order: image.Order
                };
            })
        );
    
        setFormData(prev => ({
            ...prev,
            Images: processedImages,
            existingImages: prev.existingImages.map((img, index) => ({
                ...img,
                Order: index
            }))
        }));
        
        return processedImages;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        console.log('formData', formData);
        e.preventDefault();
        
        const validationErrors = validateProject(formData);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);
        
        try {
            const existingImagesData = formData.existingImages
                .filter(img => !img.isNew)
                .map((img, index) => ({
                    ID: img.ID,
                    ImageURL: img.ShortURL || img.ImageURL,
                    Order: index
                }));
            const newImages = await handleUploadImages();
            
            const allImages = [...existingImagesData, ...newImages.filter(img => !img.ID)];
            if (isEditing) {
                await updateProjectById(formData.ID, {
                    ...formData,
                    Images: allImages,
                    MainCategoryID: formData.CategoriesID[0]
                })
                .then((res) => router.push(res.data.Slug));
            } else {
                await createProject({
                    ...formData,
                    Images: allImages,
                    MainCategoryID: formData.CategoriesID[0]
                })
                .then((res) => router.push(res.data.Slug));
            }

            showToast('Проект успешно сохранен', 'success');
            setLoading(false);
        } catch (error) {
            showToast('Ошибка при сохранении проекта', 'error');
            setLoading(false);
        }
    };

    const handleImageDelete = (index: number) => {
        const imageToDelete = formData.existingImages[index];
        
        setFormData(prev => {
            const newExistingImages = prev.existingImages.filter((_, i) => i !== index);
            
            if (imageToDelete.ID) {
                return {
                    ...prev,
                    existingImages: newExistingImages,
                    deletedImages: [...prev.deletedImages, imageToDelete.ID]
                };
            }
            
            return { ...prev, existingImages: newExistingImages };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setFormData(prev => {
            const oldIndex = prev.existingImages.findIndex((img, i) => 
                `${img.ID || img.ImageURL}-${i}` === active.id
            );
            const newIndex = prev.existingImages.findIndex((img, i) => 
                `${img.ID || img.ImageURL}-${i}` === over.id
            );

            // Получаем новый порядок изображений
            const reorderedImages = arrayMove(prev.existingImages, oldIndex, newIndex);

            // Обновляем порядок
            const updatedImages = reorderedImages.map((img, i) => ({
                ...img,
                Order: i
            }));

            return {
                ...prev,
                existingImages: updatedImages
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
    const [filteredCategories, setFilteredCategories] = useState<ProjectCategory[]>(projectCategories);
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
                                    disabled={formData.existingImages.length >= MAX_IMAGES}
                                />
                                <label 
                                    htmlFor="file-upload" 
                                    className={`inline-block px-4 py-2 rounded-md cursor-pointer ${
                                        formData.existingImages.length >= MAX_IMAGES 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {formData.existingImages.length >= MAX_IMAGES 
                                        ? 'Достигнут лимит изображений' 
                                        : 'Добавить изображения'
                                    }
                                </label>
                                <div className="text-sm text-gray-500 mt-2">
                                    {`${formData.existingImages.length}/${MAX_IMAGES} изображений`}
                                </div>
                                {errors.images && (
                                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                                )}

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={formData.existingImages.map((image, index) => `${image.ID || image.ImageURL}-${index}`)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-4 mt-4">
                                            {formData.existingImages.map((image, index) => (
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
                        <div className={`w-full ${errors.description ? 'border-2 border-red-500 rounded-md' : ''}`}>
                            <LexicalEditor
                                initialContent={project.Description || ''}
                                onChange={(content) => {
                                    handleEditorChange(content);
                                    if (errors.description) {
                                        setErrors({ ...errors, description: undefined });
                                    }
                                }}
                                className="prose max-w-none"
                            />
                        </div>
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
                            {errors.projectsCategories && (
                                <p className="text-red-500 text-sm mb-2">{errors.projectsCategories}</p>
                            )}

                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded ${errors.projectsCategories ? 'border-red-500' : ''}`}
                                    placeholder="Поиск категорий..."
                                    onChange={(e) => {
                                        handleCategorySearch(e.target.value);
                                        if (errors.projectsCategories) {
                                            setErrors({ ...errors, projectsCategories: undefined });
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