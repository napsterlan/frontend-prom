import { useState, useCallback, useEffect } from 'react';
import { createProject, uploadImages, getAllProjectCategories } from '@/api/apiClient';
import { useRouter } from 'next/router';
import { ProjectCategory } from '@/types/types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { transliterate } from '@/utils/transliterate';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';

// Функция для получения категорий проектов
export const getServerSideProps = async () => {
  let categories = [];
  
  try {
    const categoriesResponse = await getAllProjectCategories();
    categories = categoriesResponse.data;
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
  }

  return {
    props: {
      categories, // Передаем данные категорий в компонент
    },
  };
};

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b p-2 mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        Жирный
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        Курсив
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        Список
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        Нумерованный список
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`px-3 py-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        По левому краю
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`px-3 py-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        По центру
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`px-3 py-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'bg-gray-100'}`}
      >
        По правому краю
      </button>
    </div>
  );
};

const AddProject = ({ categories }: { categories: ProjectCategory[] }) => {
  const router = useRouter();
  const [editorContent, setEditorContent] = useState('');
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    CategoriesID: number[];
    Slug: string;
    newImages: File[];
    PublishDate: string | null;
  }>({
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    metaKeyword: '',
    CategoriesID: [],
    Slug: '',
    newImages: [],
    PublishDate: null,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    immediatelyRender: false
  });

  const handleImageDelete = useCallback((index: number) => {
    setFormData(prevState => ({
      ...prevState,
      newImages: prevState.newImages.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  }, [imagePreviewUrls]);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    setFormData(prevState => ({
      ...prevState,
      newImages: reorder(
        prevState.newImages,
        result.source.index,
        result.destination.index
      )
    }));

    setImagePreviewUrls(prev => 
      reorder(prev, result.source.index, result.destination.index)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...newFiles]
    }));
    
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let uploadedImages: { ImageURL: string; AltText: string; Order: number }[] = [];
      if (formData.newImages.length > 0) {
        const uploadResponse = await uploadImages(
          formData.newImages,
          `/projects/${transliterate(formData.title)}`
        );
        
        uploadedImages = formData.newImages.map((img, index) => ({
          ImageURL: uploadResponse.filePaths[index],
          AltText: '',
          Order: index
        }));
      }

      const projectData = {
        Title: formData.title,
        CategoriesID: formData.CategoriesID,
        Description: editorContent,
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        MetaKeyword: formData.metaKeyword,
        Slug: formData.Slug || formData.title.replace(/\s+/g, '-').toLowerCase() || '',
        Images: uploadedImages,
        PublishDate: formData.PublishDate ? new Date(formData.PublishDate).toISOString() : null,
      };

      await createProject(projectData);
      router.push('/admin/projects');
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      alert('Произошла ошибка при создании проекта');
    }
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

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
                />
                <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
                  Добавить изображения
                </label>
                {/* ... DragDropContext и Droppable для отображения изображений ... */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-wrap gap-4 mt-4"
                      >
                        {formData.newImages.map((image, index) => (
                          <Draggable 
                            key={`${image.name}-${index}`}
                            draggableId={`${image.name}-${index}`}
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
                                  <img
                                    src={imagePreviewUrls[index]}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleImageDelete(index)}
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
            <div className="border rounded-lg">
              <MenuBar editor={editor} />
              <div className="p-4">
                <EditorContent editor={editor} className="prose max-w-none min-h-[400px]" />
              </div>
            </div>
          </div>

          {/* Нижний блок с датой и кнопкой */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              4. Дата публикации:
              <DatePicker
                selected={formData.PublishDate ? new Date(formData.PublishDate) : null}
                onChange={(date) => setFormData({ ...formData, PublishDate: date ? date.toISOString() : null })}
                showTimeSelect
                dateFormat="Pp"
                timeFormat="HH:mm"
                timeIntervals={15}
                className="ml-2 border rounded p-2"
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Создать проект
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
