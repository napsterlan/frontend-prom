import Link from 'next/link';
import { deleteProjectCategoryById, getAllProjectCategories } from '../../../api/apiClient';
import { ProjectCategory } from '@/types/types';
import Image from 'next/image';

export const getServerSideProps = async () => {
  let categories = [];
  let error = null;

  try {
    const response = await getAllProjectCategories();
    categories = response.data;
  } catch {
    error = 'Ошибка при загрузке данных категорий';
  }
  return { props: { categories, error } };
};

const handleDelete = async (id: number) => {
  if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
    try {
      await deleteProjectCategoryById(id);
      console.log(`Удаление категории с ID: ${id}`);
      window.location.reload(); // Обновление страницы после успешного удаления
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
      alert('Произошла ошибка при удалении категории');
    }
  }
};

const ProjectCategoriesList = ({ categories }: { categories: ProjectCategory[] }) => {
    return (
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Категории проектов</h1>
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => window.location.href = '/admin/dashboard'} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Назад
            </button>
            <button 
              onClick={() => window.location.href = '/admin/projectCategories/add'} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Добавить категорию
            </button>
          </div>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Фото</th>
                <th className="py-3 px-6 text-left">Название</th>
                <th className="py-3 px-6 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {categories.map(category => (
                <tr key={category.ID} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">
                    <Image 
                      src={category.Images.length > 0 ? category.Images[0].ImageURL : '/placeholder.png'} 
                      alt={category.Images.length > 0 ? category.Images[0].AltText : 'Нет изображения'} 
                      className="object-cover" 
                      width={64}
                      height={64}
                    />
                  </td>
                  <td className="py-3 px-6">{category.Name}</td>
                  <td className="py-3 px-6 text-right">
     
                      <>
                        <Link
                          href={`/admin/projectCategories/edit/${category.Slug}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                        >
                          Редактировать
                        </Link>
                        <button 
                          onClick={() => handleDelete(category.ID)} 
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Удалить
                        </button>
                      </>
                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
};

export default ProjectCategoriesList;
