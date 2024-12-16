import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import minioClient from '@/utils/minioClient';
import axios from 'axios';
import { updateProjectById } from '@/api/apiClient';
import { useRouter } from 'next/router';

// Функция для получения данных на сервере
export const getServerSideProps = async (context: { params: { id: number } }) => {
  const { id } = context.params;
  let project = {};
  

  try {
    const response = await axios.get(`http://192.168.31.40:4000/api/projects/${Number(id)}`);
    console.log(response);
    project = response.data.data; // Получаем данные проекта
  } catch (error) {
    console.error('Ошибка загрузки проекта:', error);
  }

  return {
    props: {
      project, // Передаем данные проекта в компонент
    },
  };
};

const EditProject = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    Slug: string;
    relatedProducts: string;
    // projectImages: {
    //     ImageURL: string;
    //     AltText: string;
    // }[];
  }>({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    metaKeyword: '',
    Slug: '',
    relatedProducts: '',
    // projectImages: [],
  });
  useEffect(() => {
    if (id !== undefined) {
   
      const fetchProject = async () => {
        try {
          const project = await getProjectById(Number(id));
          console.log(project);
          setFormData({
            title: project.data.Title || '',
            description: project.data.Description || '',
            metaTitle: project.data.MetaTitle || '',
            metaDescription: project.data.MetaDescription || '',
            metaKeyword: project.data.MetaKeyword || '',
            Slug: project.data.Slug || '',
            relatedProducts: project.data.RelatedProducts || ''
            // projectImages: project.data.ProjectImages.map((img: any) => ({
            //     ImageURL: img.ImageURL,
            //     AltText: img.AltText,
            // })),
          });
        } catch (error) {
          console.error('Ошибка загрузки проекта:', error);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправляемые данные:', formData);
    try {
<<<<<<< HEAD
=======


>>>>>>> bd44493 (ColunmVisibility changes)
      const projectData = {
        Title: formData.title,
        ProjectCategories: formData.ProjectCategories,
        Description: formData.description,
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        MetaKeyword: formData.metaKeyword,
        Slug: formData.Slug || formData.title.replace(/\s+/g, '-').toLowerCase() || '',
<<<<<<< HEAD
=======
        RelatedProducts: formData.relatedProducts,
        //ProjectImages: uploadedImages,
>>>>>>> bd44493 (ColunmVisibility changes)
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
            <DragDropContext onDragEnd={(result: any) => {
              const { source, destination } = result;
              if (!destination) return;

              const reorderedImages = Array.from(formData.projectImages);
              const [removed] = reorderedImages.splice(source.index, 1);
              reorderedImages.splice(destination.index, 0, removed);

              setFormData({ ...formData, projectImages: reorderedImages });
            }}>
              <Droppable droppableId="droppable">
                {(provided: any) => (
                  <div
                    className="flex flex-wrap mt-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {formData.projectImages.map((file, index) => (
                      <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                        {(provided: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative w-48 h-48 m-2"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Изображение ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              onClick={() => {
                                const updatedImages = formData.projectImages.filter((_, i) => i !== index);
                                setFormData({ ...formData, projectImages: updatedImages });
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div> */}
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
