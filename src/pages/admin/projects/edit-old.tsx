import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProjectById, updateProjectById } from '../../../api/apiClient'; // Импортируем необходимые функции
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const EditProject = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    seoURL: string;
    projectImages: File[];
    relatedProducts: string;
  }>({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    metaKeyword: '',
    seoURL: '',
    projectImages: [],
    relatedProducts: '',
  });

  useEffect(() => {
    console.log('функция вызвалась');
    const fetchProject = async () => {
      
      if (id) {
        const project = await getProjectById(Number(id)); // Получаем данные проекта
        console.log(project);
        setFormData(project);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправляемые данные:', formData);
    try {
      const projectData = {
        Title: formData.title,
        Description: formData.description,
        ProjectImages: formData.projectImages.map((file, index) => ({
          ImageURL: URL.createObjectURL(file),
          AltText: `Изображение проекта ${index + 1}`,
        })),
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        MetaKeyword: formData.metaKeyword,
        SeoURL: formData.seoURL || formData.title.replace(/\s+/g, '-').toLowerCase() || '',
      };

      const response = await updateProjectById(Number(id), projectData); // Обновляем проект

      if (response) {
        alert('Проект успешно обновлен!');
        router.push('/projects');
      }
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-lg">
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
              value={formData.seoURL}
              onChange={(e) => setFormData({ ...formData, seoURL: e.target.value })}
            />
          </div>
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
                    {formData.projectImages.map((file, index) => (
                      <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                        {(provided: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative w-24 h-24 m-2"
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
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
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
            Добавить проект
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
