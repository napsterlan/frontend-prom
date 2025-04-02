'use client';

import { Project, ProjectCategory } from '@/types/types';
import { updateProjectById } from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import Image from 'next/image';
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

registerLocale('ru', ru);
setDefaultLocale('ru');

const MAX_IMAGES = 20;

interface ProjectFormProps {
    project: Project;
    categories: ProjectCategory[];
    isEditing: boolean;
}

export function ProjectForm({ project, categories, isEditing }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [editorContent, setEditorContent] = useState(project.Description || '');
    const [formData, setFormData] = useState<{
        ID: number;
        title: string;
        name: string;
        description: string;
        metaTitle: string;
        metaDescription: string;
        metaKeyword: string;
        CategoriesID: number[];
        Slug: string;
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
        }>;
        newImages: File[];
        deletedImages: number[];
        PublishDate: Date | null;
      }>({
        ID: project.ID || 0,
        title: project.Title || '',
        name: project.Name || '',
        description: project.Description || '',
        metaTitle: project.MetaTitle || '',
        metaDescription: project.MetaDescription || '',
        metaKeyword: project.MetaKeyword || '',
        CategoriesID: project.ProjectsCategories?.map((cat) => cat.ID) || [],
        Slug: project.Slug || '',
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
            AltText: img.AltText || ''
          }))
          .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)),
        newImages: [],
        deletedImages: [],
        PublishDate: project.PublishDate ? new Date(project.PublishDate) : null,
      });
    
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
            isNew: true
        }));

        setFormData(prev => ({
            ...prev,
            existingImages: [...prev.existingImages, ...newPreviewImages],
            newImages: [...prev.newImages, ...newFiles]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateProjectById(formData.ID, formData);
            router.push('/admin/projects');
            router.refresh();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Ошибка при сохранении проекта');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageDelete = (index: number, isExisting: boolean) => {
        console.log('удаление картинки', index, isExisting);
        const imageToDelete = formData.existingImages[index];
        
        setFormData(prev => {
            // Удаляем изображение из existingImages
            const newExistingImages = prev.existingImages.filter((_, i) => i !== index);
            
            // Если это существующее изображение с ID, добавляем его в deletedImages
            if (imageToDelete.ID) {
                return {
                    ...prev,
                    existingImages: newExistingImages,
                    deletedImages: [...prev.deletedImages, imageToDelete.ID]
                };
            }
            
            // Если это новое изображение, удаляем соответствующий файл из newImages
            if (imageToDelete.isNew) {
                const newImageIndex = prev.existingImages
                    .slice(0, index)
                    .filter(img => img.isNew)
                    .length;
                
                return {
                    ...prev,
                    existingImages: newExistingImages,
                    newImages: prev.newImages.filter((_, i) => i !== newImageIndex)
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
        setEditorContent(content);
        debouncedSetFormData(content);
    }, [debouncedSetFormData]);

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

    return (
        <form onSubmit={handleSubmit}>
        {/* Верхний блок с двумя колонками */}
        <div className="flex gap-6 mb-6">
          {/* Левая колонка - изображения */}
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-6">1. Изображения проекта</h2>
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
                        onDelete={() => handleImageDelete(index, true)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {/* Правая колонка - основная информация */}
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-6">2. Основная информация</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Название</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2">Категории проекта</label>
                <div className="max-h-48 overflow-y-auto border rounded p-2">
                  <label className="block mb-2">Выберите категории</label>
                  {categories.map((category) => (
                    <div key={category.ID} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`category-${category.ID}`}
                        checked={formData.CategoriesID.includes(category.ID)}
                        onChange={() => {
                          const newCategories = formData.CategoriesID.includes(category.ID)
                            ? formData.CategoriesID.filter((id) => id !== category.ID)
                            : [...formData.CategoriesID, category.ID];
                          setFormData({ ...formData, CategoriesID: newCategories });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.ID}`} className="cursor-pointer">
                        {category.Name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Мета-информация */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Мета Заголовок</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2">Мета Описание</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2">Мета Ключевые слова</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.metaKeyword}
                    onChange={(e) => setFormData({ ...formData, metaKeyword: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Блок описания на всю ширину */}
        <div className="w-full mb-6">
          <h2 className="text-2xl font-bold mb-4">3. Описание проекта</h2>
          <LexicalEditor
            initialContent={project.Description || ''}
            onChange={handleEditorChange}
            className="prose max-w-none"
          />
        </div>

        {/* Нижний блок с датой и кнопкой */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            4. Дата публикации:
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
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Сохранить проект
          </button>
        </div>
      </form>
    );
} 