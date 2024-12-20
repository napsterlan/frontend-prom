import { useState } from 'react';
import { useRouter } from 'next/router';
import { getProjectCategoryById, updateProjectCategoryById, uploadFiles } from '../../../../api/apiClient';
import { ProjectCategory } from '@/types/types';

export const getServerSideProps = async (context: { params: { id: number } }) => {
  const { id } = context.params;
  let category = {};
  
  try {
    const response = await getProjectCategoryById(id);
    category = response.data;
    console.log(category);
  } catch (error) {
    console.error('Ошибка загрузки категории:', error);
  }

  return { props: { category } };
};

const EditProjectCategory = ({ category }: { category: ProjectCategory }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    existingImage: string;
    newImage: File | null;
  }>({
    name: category.Name || '',
    slug: category.Slug || '',
    existingImage: category.Images[0].ImageURL || '',
    newImage: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageURL = formData.existingImage;

      // Загружаем новое изображение, если оно было выбрано
      if (formData.newImage) {
        const uploadResponse = await uploadFiles(
          [formData.newImage],
          `/categories/${formData.name}`
        );
        imageURL = uploadResponse.filePaths[0];
      }

      const categoryData = {
        Name: formData.name,
        Slug: formData.slug || formData.name.replace(/\s+/g, '-').toLowerCase(),
        ImageURL: imageURL
      };

      await updateProjectCategoryById(Number(router.query.id), categoryData);
      router.push('/admin/projectCategories');
    } catch (error) {
      console.error('Ошибка обновления категории:', error);
      alert('Произошла ошибка при обновлении категории');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Редактировать категорию проекта</h1>
        
        <div className="mb-6">
          <label className="block mb-2">Изображение категории</label>
          {formData.existingImage && !formData.newImage && (
            <div className="relative w-48 h-48 mb-4">
              <img
                src={formData.existingImage}
                alt="Текущее изображение"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          {formData.newImage && (
            <div className="relative w-48 h-48 mb-4">
              <img
                src={URL.createObjectURL(formData.newImage)}
                alt="Новое изображение"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData({ ...formData, newImage: file });
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Выбрать изображение
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Название</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">SEO URL (SLUG)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="example-slug"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Сохранить категорию
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProjectCategory;
