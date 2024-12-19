import { useState } from 'react';
import { createProjectCategory } from '../../../api/apiClient';

const AddProjectCategory = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createProjectCategory({ Name: name });
    // Перенаправление или обновление списка после добавления
  };

  return (
    <div>
      <h1>Добавить категорию проекта</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название категории"
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddProjectCategory;
