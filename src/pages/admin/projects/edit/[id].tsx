import { useState } from 'react';
import { updateProjectById, uploadFiles } from '@/api/apiClient';
import { getAllProjectCategories, getProjectById } from '@/api/apiClient';
import { useRouter } from 'next/router';
import { ProjectCategory } from '@/types/types';
import { Project } from '@/types/types';

// Функция для получения данных на сервере
export const getServerSideProps = async (context: { params: { id: number } }) => {
  const { id } = context.params;
  let project = {};
  let categories = [];
  
  try {
    const categoriesResponse = await getAllProjectCategories();
    categories = categoriesResponse.data;

    const response = await getProjectById(Number(id));
    project = response.data; // Получаем данные проекта
    console.log(project);
  } catch (error) {
    console.error('Ошибка загрузки проекта:', error);
  }

  return {
    props: {
      project, // Передаем данные проекта в компонент
      categories, // Передаем данные категорий в компонент
    },
  };
};

const EditProject = ({ project, categories }: { project: Project, categories: ProjectCategory[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    ProjectCategories: any[];
    Slug: string;
    relatedProducts: any[];
    existingImages: any[];
    newImages: File[];
    deletedImageIds: number[];
  }>({
    title: project.Title || '',
    description: project.Description || '',
    metaTitle: project.MetaTitle || '',
    metaDescription: project.MetaDescription || '',
    metaKeyword: project.MetaKeyword || '',
    ProjectCategories: project.ProjectCategories || [],
    Slug: project.Slug || '',
    relatedProducts: project.RelatedProducts || [],
    existingImages: project.Images || [],
    newImages: [],
    deletedImageIds: [],
  });

  const handleImageDelete = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const imageToDelete = formData.existingImages[index];
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index),
        deletedImageIds: [...formData.deletedImageIds, imageToDelete.ID]
      });
    } else {
      setFormData({
        ...formData,
        newImages: formData.newImages.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправляемые данные:', formData);
    try {
      // Загружаем только новые файлы
      let uploadedImages = [];
      if (formData.newImages.length > 0) {
        const uploadResponse = await uploadFiles(
          formData.newImages,
          `/projects/${formData.title}`
        );
        uploadedImages = uploadResponse.filePaths.map((imageUrl: string) => ({
          ImageURL: imageUrl,
          AltText: '',
        }));
      }

      const projectData = {
        Title: formData.title,
        ProjectCategories: formData.ProjectCategories,
        Description: formData.description,
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        MetaKeyword: formData.metaKeyword,
        Slug: formData.Slug || formData.title.replace(/\s+/g, '-').toLowerCase() || '',
        RelatedProducts: formData.relatedProducts,
        ProjectImages: [
          ...formData.existingImages.map(img => ({
            ID: img.ID,
            ImageURL: img.ImageURL,
            AltText: img.AltText
          })),
          ...uploadedImages
        ],
        deletedImageIds: formData.deletedImageIds
      };

      const response = await updateProjectById(Number(router.query.id), projectData);

      if (response) {
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
      alert('Произошла ошибка при обновлении проекта');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full p-6 bg-white rounded-lg shadow-lg flex">
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-6">Добавить изображения проекта</h1>
          <div className="mb-4">
            <label className="block mb-2">Изображения проекта</label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                setFormData({ ...formData, newImages: [...formData.newImages, ...newFiles] });
              }}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
              Добавить
            </label>
            <div className="flex flex-wrap mt-2">
              {/* Существующие изображения */}
              {formData.existingImages.map((file: any, index: number) => (
                <div key={`existing-${index}`} className="relative w-48 h-48 m-2">
                  <img
                    src={file.ImageURL}
                    alt={file.AltText || `Изображение ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => handleImageDelete(index, true)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8"
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              {/* Новые изображения */}
              {formData.newImages.map((file: File, index: number) => (
                <div key={`new-${index}`} className="relative w-48 h-48 m-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Новое изображение ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => handleImageDelete(index, false)}
                    className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-6">Добавить новый проект</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Название</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Категории проекта</label>
              <select
                multiple
                className="w-full p-2 border rounded"
                value={formData.ProjectCategories}
                onChange={(e) => {
                  const options = e.target.options;
                  const selectedCategories = [];
                  for (let i = 0; i < options.length; i++) {
                    if (options[i].selected) {
                      selectedCategories.push(options[i].value);
                    }
                  }
                  setFormData({ ...formData, ProjectCategories: selectedCategories });
                }}
              >
                {categories.map((category: { ID: number; Name: string }) => (
                  <option key={category.ID} value={category.ID}>
                    {category.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Описание</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Мета Заголовок</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Мета Описание</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Мета Ключевые слова</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.metaKeyword}
                onChange={(e) => setFormData({ ...formData, metaKeyword: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">SEO URL</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.Slug}
                onChange={(e) => setFormData({ ...formData, Slug: e.target.value })}
              />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Сохранить проект
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
