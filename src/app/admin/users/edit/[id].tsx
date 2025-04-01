import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getUserById, updateUserById } from '../../../../api/apiClient';
import { User } from '../../../../types/types';

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  const data = await getUserById(Number(id));
  return {
    props: {
      user: data.data,
    },
  };
}

const UserDetail: React.FC<{ user: User }> = ({ user }) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserById(editedUser.ID, editedUser);
      router.push('/admin/users'); // Перенаправление после успешного обновления
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  return (
    <div className="container mx-auto p-2 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Редактирование пользователя</h1>
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => window.history.back()} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-lg mb-2">Имя:</label>
          <input type="text" name="FirstName" value={editedUser.FirstName} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Фамилия:</label>
          <input type="text" name="LastName" value={editedUser.LastName} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Email:</label>
          <input type="email" name="Email" value={editedUser.Email} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Телефон:</label>
          <input type="text" name="Phone" value={editedUser.Phone} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Компания:</label>
          <input type="text" name="Company" value={editedUser.Company || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Активирован:</label>
          <input type="checkbox" name="Activated" checked={editedUser.Activated} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Статус:</label>
          <input type="checkbox" name="Status" checked={editedUser.Status} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Сохранить</button>
      </form>
    </div>
  );
};

export default UserDetail;
