import { useState } from 'react';
import { useRouter } from 'next/router';
import { getProjectCategoryById, updateProjectCategoryById } from '../../../../api/apiClient';
import { ProjectCategory } from '@/types/types';

export const getServerSideProps = async (context: { params: { id: number } }) => {
  const { id } = context.params;
  const category = await getProjectCategoryById(id);
  return { props: { category } };
};

const EditProjectCategory = ({ category }: { category: ProjectCategory }) => {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState('');
  console.log( category);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProjectCategoryById(Number(id), { Name: name });
    // Перенаправление или обновление списка после редактирования
  };

  return (
    <div>
      <h1>Редактировать категорию проекта</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название категории"
        />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default EditProjectCategory;
