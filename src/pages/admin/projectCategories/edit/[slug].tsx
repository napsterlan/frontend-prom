import { useState } from 'react';
import { useRouter } from 'next/router';
import { getProjectCategoryBySlug, updateProjectCategoryById, uploadImages } from '../../../../api/apiClient';
// import {uploadFiles } from '../../../../api/apiClient';
import { ProjectCategory } from '@/types/types';
import { transliterate } from '@/utils/transliterate';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { DraggableImage } from '@/types/types';
import Image from 'next/image';

export const getServerSideProps = async (context: { params: { slug: string } }) => {
  const { slug } = context.params;
  let category = {};
  
  try {
    const response = await getProjectCategoryBySlug(slug);
    category = response.data;
  } catch (error) {
    console.error('Ошибка загрузки категории:', error);
  }

  return { props: { category } };
};

const EditProjectCategory = ({ category }: { category: ProjectCategory }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    existingImages: Array<{
      ID?: number;
      ImageURL: string;
      AltText: string;
      Order: number;
      isNew: boolean;
    }>;
    newImages: File[];
    deletedImages: number[];
  }>({
    name: category.Name || '',
    existingImages: (category.Images || [])
      .map((img, index) => ({
        ...img,
        Order: typeof img.Order === 'number' ? img.Order : index,
        ID: img.ID || undefined,
        ImageURL: img.ImageURL || '',
        AltText: img.AltText || '',
        isNew: false
      }))
      .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0)),
    newImages: [],
    deletedImages: [],
  });

  const handleImageDelete = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const imageToDelete = formData.existingImages[index];
      if (imageToDelete.ID) {
        setFormData({
          ...formData,
          existingImages: formData.existingImages.filter((_, i) => i !== index),
          deletedImages: [...formData.deletedImages, imageToDelete.ID]
        });
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorder = (list: DraggableImage[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({
        ...item,
        Order: index
      }));
    };

    setFormData(prevState => ({
      ...prevState,
      existingImages: reorder(
        prevState.existingImages,
        result.source.index,
        result.destination!.index
      )
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
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
    try {
      let uploadedImages: { ImageURL: string; AltText: string; Order: number }[] = [];
      
      if (formData.newImages.length > 0) {
        const uploadResponse = await uploadImages(
          formData.newImages,
          `/categories/${transliterate(formData.name)}`
        );
        
        uploadedImages = formData.existingImages
          .filter(img => img.isNew)
          .map((img, index) => ({
            ImageURL: uploadResponse.filePaths[index],
            AltText: img.AltText,
            Order: img.Order
          }));
      }

      const categoryData = {
        ID: category.ID,
        Name: formData.name,
        Images: [
          ...formData.existingImages
            .filter(img => !img.isNew)
            .map(img => ({
              ID: img.ID,
              Order: img.Order
            })),
          ...uploadedImages
        ],
        DeletedImages: formData.deletedImages,
      };

      await updateProjectCategoryById(category.ID, categoryData);
      router.push('/admin/projectCategories');
    } catch (error) {
      console.error('Ошибка обновления категории:', error);
      alert('Произошла ошибка при обновлении категории');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      
      <div className="max-w-[1200px] w-full">
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => window.location.href = '/admin/dashboard'} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Назад
            </button>
          </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 mb-6">
            {/* Левая колонка - изображения */}
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-6">1. Изображения категории</h2>
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
                  Добавить изображения
                </label>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-wrap gap-4 mt-4"
                      >
                        {formData.existingImages.map((image, index) => (
                          <Draggable 
                            key={`${image.ID || image.ImageURL}-${index}`}
                            draggableId={`${image.ID || image.ImageURL}-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative group"
                              >
                                <div className="w-40 h-40 border rounded-lg overflow-hidden">
                                  <Image
                                    src={image.ImageURL}
                                    alt={image.AltText || 'Category image'}
                                    className="object-cover"
                                    width={160}
                                    height={160}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleImageDelete(index, true)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                  {index + 1}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Сохранить категорию
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectCategory;
