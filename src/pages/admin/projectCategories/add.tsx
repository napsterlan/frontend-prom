import { useState } from 'react';
import { useRouter } from 'next/router';
import { createProjectCategory, uploadImages } from '../../../api/apiClient';
import { transliterate } from '@/utils/transliterate';

const AddProjectCategory = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    newImages: File[];
  }>({
    name: '',
    slug: '',
    newImages: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageURLs: string[] = [];

      if (formData.newImages.length > 0) {
        const uploadResponse = await uploadImages(
          formData.newImages,
          `/categories/${transliterate(formData.name)}`
        );
        imageURLs = uploadResponse.filePaths;
      }

      const slug = formData.slug || transliterate(formData.name);
      
      const categoryData = {
        Name: formData.name,
        Slug: slug,
        Images: imageURLs.map(url => ({ 
          ImageUrl: url,
          AltText: formData.name
         }))
      };
      console.log(categoryData);

      await createProjectCategory(categoryData);
      router.push('/admin/projectCategories');
    } catch (error) {
      console.error('Ошибка создания категории:', error);
      alert('Произошла ошибка при создании категории');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Добавить категорию проекта</h1>
        
        <div className="mb-6">
          <label className="block mb-2">Изображения категории</label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {formData.newImages.map((file, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Новое изображение ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => {
                    const newImages = formData.newImages.filter((_, i) => i !== index);
                    setFormData({ ...formData, newImages: newImages });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData({ ...formData, newImages: [...formData.newImages, ...files] });
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Выбрать изображения
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
            Создать категорию
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectCategory;
