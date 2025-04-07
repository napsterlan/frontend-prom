'use client';

import { Project, ProjectCategory, IProductCategory, User } from '@/types/types';
import { createProject, updateProjectById, getManagersList, getCategoryBySlug } from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import DatePicker from 'react-datepicker';
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
import { searchFor } from '@/api/apiClient';

registerLocale('ru', ru);
setDefaultLocale('ru');

const MAX_IMAGES = 20;

interface ProjectFormProps {
    project: Project;
    projectCategories: ProjectCategory[];
    productCategories: IProductCategory[];
    isEditing: boolean;
}

type TabType = 'main' | 'relations';

// Создаем контекст для кеширования данных категорий
interface CategoryCacheContextType {
    categoriesCache: Record<string, IProductCategory>;
    addToCache: (slug: string, data: IProductCategory) => void;
    getFromCache: (slug: string) => IProductCategory | null;
}

const CategoryCacheContext = createContext<CategoryCacheContextType>({
    categoriesCache: {},
    addToCache: () => {},
    getFromCache: () => null
});

// Провайдер для хранения кеша
function CategoryCacheProvider({ children }: { children: React.ReactNode }) {
    const [categoriesCache, setCategoriesCache] = useState<Record<string, IProductCategory>>({});

    const addToCache = useCallback((slug: string, data: IProductCategory) => {
        setCategoriesCache(prev => ({
            ...prev,
            [slug]: data
        }));
    }, []);

    const getFromCache = useCallback((slug: string) => {
        return categoriesCache[slug] || null;
    }, [categoriesCache]);

    return (
        <CategoryCacheContext.Provider value={{ categoriesCache, addToCache, getFromCache }}>
            {children}
        </CategoryCacheContext.Provider>
    );
}

// Хук для доступа к кешу
function useCategoryCache() {
    return useContext(CategoryCacheContext);
}

export function ProjectForm({ project, projectCategories, productCategories, isEditing }: ProjectFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabType>('main');

    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState<User[]>([]);
    const [formData, setFormData] = useState<{
        ID: number;
        title: string;
        Name: string;
        description: string;
        metaTitle: string;
        metaDescription: string;
        metaKeyword: string;
        CategoriesID: number[];
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
        deletedImages: number[];
        PublishDate: Date | null;
        UserID: number | null;
      }>({
        ID: project.ID ?? 0,
        title: project.Title || '',
        Name: project.Name || '',
        description: project.Description || '',
        metaTitle: project.MetaTitle || '',
        metaDescription: project.MetaDescription || '',
        metaKeyword: project.MetaKeyword || '',
        CategoriesID: project.ProjectsCategories?.map((cat) => cat.ID) || [],
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
        deletedImages: [],
        PublishDate: project.PublishDate ? new Date(project.PublishDate) : null,
        UserID: project.User?.ID || null
      });

    const [isAutoSlug, setIsAutoSlug] = useState(!isEditing ? true : false);
    useEffect(() => {
        if (isAutoSlug && formData.title) {
            setFormData(prev => ({
                ...prev,
                Slug: toSlug(formData.title)
            }));
        }
    }, [formData.title, isAutoSlug]);

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
        e.preventDefault();
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
                })
                .then((res) => router.push(res.data.Slug));
            } else {
                await createProject({
                    ...formData,
                    Images: allImages,
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

    const handleToggleProduct = (product: any) => {
        setFormData(prev => {
            const isProductSelected = prev.relatedProducts.some(p => p.ID === product.ID);
            
            if (isProductSelected) {
                // Если продукт уже выбран, удаляем его
                return {
                    ...prev,
                    relatedProducts: prev.relatedProducts.filter(p => p.ID !== product.ID)
                };
            } else {
                // Если продукт не выбран, добавляем его
                return {
                    ...prev,
                    relatedProducts: [...prev.relatedProducts, product]
                };
            }
        });
    };

    const [productSearchQuery, setProductSearchQuery] = useState('');

    const testQuery = async () => {
        const response = await searchFor('офис', 'category', 1, '');
        console.log('response', response);
    }

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
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.Name}
                                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label>SEO URL</label>
                                        <div 
                                            onClick={() => setIsAutoSlug(!isAutoSlug)}
                                            className="flex items-center gap-2 cursor-pointer select-none"
                                        >
                                            <span className="text-sm text-gray-500">Авто</span>
                                            <div className={`w-8 h-4 rounded-full transition-colors ${isAutoSlug ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                                <div className={`w-3 h-3 rounded-full bg-white transform transition-transform mt-0.5 ${isAutoSlug ? 'translate-x-4' : 'translate-x-1'}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded font-mono"
                                        value={formData.Slug}
                                        onChange={handleSlugChange}
                                        disabled={isAutoSlug}
                                        placeholder="seo-url"
                                    />
                                </div>

                                <div>
                                <label className="block mb-2">metaTitle</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                />
                                </div>

                                <div>
                                    <label className="block mb-2">metaKeyword</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.metaKeyword}
                                        onChange={(e) => setFormData({ ...formData, metaKeyword: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2">metaDescription</label>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2">Ответственный менеджер</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={formData.UserID || ''}
                                        onChange={(e) => {
                                            const selectedManager = managers.find(m => m.ID === Number(e.target.value));
                                            setFormData(prev => ({ ...prev, UserID: selectedManager?.ID || null }));
                                        }}
                                    >
                                        <option value="">Выберите менеджера</option>
                                        {managers.map((manager) => (
                                            <option key={manager.ID} value={manager.ID}>
                                                {manager.LastName} {manager.FirstName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="mb-2">
                                        Дата публикации:
                                        <DatePicker
                                            selected={formData.PublishDate}
                                            onChange={(date) => setFormData({ ...formData, PublishDate: date })}
                                            showTimeSelect
                                            dateFormat="dd.MM.yyyy HH:mm"
                                            timeFormat="HH:mm"
                                            timeCaption="Время"
                                            locale="ru"
                                            placeholderText="Выберите дату и время"
                                            timeIntervals={15}
                                            className="ml-2 border rounded p-2 w-[200px]"
                                            popperPlacement="bottom-start"
                                            customInput={
                                                <input
                                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Блок описания на всю ширину */}
                    <div className="w-full mb-6">
                        <h2 className="text-2xl font-bold mb-4">3. Описание проекта</h2>
                        <div className="w-full">
                            <LexicalEditor
                                initialContent={project.Description || ''}
                                onChange={handleEditorChange}
                                className="prose max-w-none"
                            />
                        </div>
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

                            <button
                            type='button'
                                onClick={() => testQuery()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                test
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    placeholder="Поиск категорий..."
                                    onChange={(e) => handleCategorySearch(e.target.value)}
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                
                                {/* Выпадающий список */}
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                                        {filteredCategories.map((category) => (
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

                    <div>
                        <div>
                            <label className="block mb-2">Связанные категории продуктов</label>

                            <div className="border rounded p-4 max-h-[600px]">
                                <div className="sticky top-0 bg-white pb-2 mb-2 border-b">
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        placeholder="Поиск по категориям..."
                                        onChange={(e) => setProductSearchQuery(e.target.value)}
                                        value={productSearchQuery}
                                    />
                                    {productSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setProductSearchQuery('')}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-auto max-h-[520px]">
                                    <CategoryCacheProvider>
                                        {productCategories.map((category) => (
                                            <TreeCategoryNode 
                                                key={category.ID} 
                                                category={category} 
                                                selectedProducts={formData.relatedProducts}
                                                onToggleProduct={handleToggleProduct}
                                                level={0}
                                                searchQuery={productSearchQuery}
                                            />
                                        ))}
                                    </CategoryCacheProvider>
                                </div>
                            </div>

                            {formData.relatedProducts.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Выбранные товары:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.relatedProducts.map(product => (
                                            <div 
                                                key={product.ID} 
                                                className="flex items-center p-2 bg-blue-50 rounded gap-2 text-sm"
                                            >
                                                {product.Images && product.Images.length > 0 && (
                                                    <div className="w-8 h-8 relative flex-shrink-0">
                                                        <img 
                                                            src={product.Images[0].ImageURL} 
                                                            alt={product.Name} 
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                                <span>{product.Name}</span>
                                                <button 
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleToggleProduct(product)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}

interface TreeCategoryNodeProps {
    category: IProductCategory;
    level?: number;
    selectedProducts: {
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
    onToggleProduct: (product: any) => void;
    searchQuery: string;
}

function TreeCategoryNode({ category, level = 0, selectedProducts, onToggleProduct, searchQuery }: TreeCategoryNodeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [childCategories, setChildCategories] = useState<IProductCategory[] | null>(category.ChildrenCategories);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMatchingDeepChildren, setHasMatchingDeepChildren] = useState(false);
    const { getFromCache, addToCache } = useCategoryCache();
    
    // Автоматически раскрывать категорию при поиске
    useEffect(() => {
        if (searchQuery && !isOpen) {
            const categoryMatchesSearch = category.Name.toLowerCase().includes(searchQuery.toLowerCase());
            const hasChildCategories = childCategories && childCategories.length > 0;
            
            // Раскрываем категорию либо если она сама соответствует запросу, 
            // либо если у нее есть дочерние категории (чтобы проверить их)
            if (categoryMatchesSearch || (hasChildCategories || category.Slug)) {
                toggleOpen();
            }
        }
    }, [searchQuery]);

    // Проверяем, содержит ли текущая категория искомый текст
    const categoryMatchesSearch = searchQuery 
        ? category.Name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

    // Проверяем, соответствуют ли дочерние категории первого уровня поисковому запросу
    const hasMatchingDirectChildren = searchQuery && childCategories
        ? childCategories.some(child => child.Name.toLowerCase().includes(searchQuery.toLowerCase()))
        : false;
    
    // Функция для отслеживания результатов из дочерних компонентов
    const updateHasMatchingChildren = (hasMatches: boolean) => {
        if (hasMatches && !hasMatchingDeepChildren) {
            setHasMatchingDeepChildren(true);
            // Если найдены соответствия в глубоких дочерних элементах, раскрываем родителя
            if (!isOpen && searchQuery) {
                setIsOpen(true);
            }
        }
    };
    
    // Должны ли мы показывать эту категорию?
    // 1. Если нет поиска - показываем все
    // 2. Если категория соответствует поиску - показываем
    // 3. Если прямые дочерние элементы соответствуют - показываем
    // 4. Если глубокие дочерние элементы соответствуют - показываем
    const shouldShowCategory = !searchQuery || 
                               categoryMatchesSearch || 
                               hasMatchingDirectChildren || 
                               hasMatchingDeepChildren;

    // Функция для загрузки подкатегорий
    const toggleOpen = async () => {
        if (!isOpen && category.Slug) {
            // Проверяем наличие данных в кеше
            const cachedData = getFromCache(category.Slug);
            
            if (cachedData) {
                // Используем данные из кеша
                setChildCategories(cachedData.ChildrenCategories || []);
                
                // Если активен поиск, проверяем на соответствие
                if (searchQuery && cachedData.ChildrenCategories) {
                    const hasMatches = cachedData.ChildrenCategories.some(
                        (child: IProductCategory) => child.Name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    if (hasMatches) {
                        setHasMatchingDeepChildren(true);
                    }
                }
            } else {
                // Если данных нет в кеше, делаем запрос
                setIsLoading(true);
                try {
                    const response = await getCategoryBySlug(category.Slug);
                    setChildCategories(response.data.ChildrenCategories || []);
                    
                    // Сохраняем полученные данные в кеш
                    addToCache(category.Slug, response.data);
                    
                    // Если активен поиск и загружены подкатегории, проверяем их на соответствие
                    if (searchQuery && response.data.ChildrenCategories) {
                        const hasMatches = response.data.ChildrenCategories.some(
                            (child: IProductCategory) => child.Name.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        if (hasMatches) {
                            setHasMatchingDeepChildren(true);
                        }
                    }
                } catch (error) {
                    console.error('Ошибка при загрузке подкатегорий:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        setIsOpen(!isOpen);
    };

    const isExpandable = (childCategories && childCategories.length > 0) || (!childCategories && category.Slug);

    if (!shouldShowCategory) {
        return null;
    }

    return (
        <div className="pl-2">
            <div 
                className={`flex items-center py-2 cursor-pointer hover:bg-gray-50 group ${
                    searchQuery && categoryMatchesSearch ? 'bg-yellow-50' : ''
                }`}
                onClick={toggleOpen}
            >
                <div className="w-5 mr-2 text-gray-500 flex items-center justify-center">
                    {isExpandable ? (
                        isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-blue-500">
                                <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" transform="rotate(180, 8, 8)" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-blue-500">
                                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        )
                    ) : (
                        <span className="w-4 inline-block"></span>
                    )}
                </div>
                <div className="flex-1 truncate font-medium" style={{ paddingLeft: `${level * 20}px` }}>
                    {category.Name}
                </div>
            </div>

            {isLoading && (
                <div className="pl-10 py-2 text-sm text-gray-500">
                    Загрузка...
                </div>
            )}

            {isOpen && childCategories && childCategories.length > 0 && (
                <div className="pl-6 border-l ml-2 border-gray-200">
                    {childCategories.map(childCategory => (
                        <TreeCategoryNode
                            key={childCategory.ID}
                            category={childCategory}
                            level={level + 1}
                            selectedProducts={selectedProducts}
                            onToggleProduct={onToggleProduct}
                            searchQuery={searchQuery}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 