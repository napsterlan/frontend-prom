import { useState } from 'react';
import { useRouter } from 'next/router';
import { getProjectById, updateProjectById } from '../../../../api/apiClient';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import minioClient from '@/utils/minioClient';

const EditProject = ({ project }: { project: any }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: project.Title || '',
    description: project.Description || '',
    metaTitle: project.MetaTitle || '',
    metaDescription: project.MetaDescription || '',
    metaKeyword: project.MetaKeyword || '',
    Slug: project.Slug || '',
    relatedProducts: project.RelatedProducts || '',
    projectImages: (project.ProjectImages || []).map((img: any) => ({
      ImageURL: img.ImageURL,
      AltText: img.AltText,
    })) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправляемые данные:', formData);
    try {
      const uploadedImages = await Promise.all(
        (formData.projectImages || []).map(async (file: any) => {
          const imageBuffer = await file.arrayBuffer();

          // Функция для отправки изображения в MinIO
          const uploadImageToMinIO = async (file: File): Promise<string> => {
            const objectName = `projects/${formData.title}/${file.name}`;
            
            await minioClient.putObject(
              'promled-website-test',
              objectName,
              Buffer.from(imageBuffer)
            );

            // Получаем временный URL, который истекает через 7 дней
            const url = await minioClient.presignedGetObject(
              'promled-website-test',
              objectName,
              7 * 24 * 60 * 60
            );

            return url;
          };

          return { ImageURL: await uploadImageToMinIO(file), AltText: file.name };
        })
      );

      const projectData = {
        Title: formData.title,
        Description: formData.description,
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        MetaKeyword: formData.metaKeyword,
        Slug: formData.Slug || formData.title.replace(/\s+/g, '-').toLowerCase() || '',
        RelatedProducts: formData.relatedProducts,
        ProjectImages: uploadedImages,
      };

      const response = await updateProjectById(Number(router.query.id), projectData);

      if (response) {
        alert('Проект успешно обновлён!');
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
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
                setFormData({ ...formData, projectImages: [...formData.projectImages, ...newFiles] });
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
                    {formData.projectImages.map((file: any, index: any) => (
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
                                const updatedImages = formData.projectImages.filter((_: any, i: any) => i !== index);
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
            <div className="mb-4">
              <label className="block mb-2">Связанные продукты</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.relatedProducts}
                onChange={(e) => setFormData({ ...formData, relatedProducts: e.target.value })}
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

// Функция для получения данных на сервере
export const getServerSideProps = async (context: any) => {
  const { id } = context.params;
  let project = {};
  console.log(id);

  try {
    const response = await getProjectById(Number(id));
    project = response.data; // Получаем данные проекта
    console.log(project);
  } catch (error) {
    console.error('Ошибка загрузки проекта:', error);
  }

  return {
    props: {
      project, // Передаем данные проекта в компонент
    },
  };
};

export default EditProject;
