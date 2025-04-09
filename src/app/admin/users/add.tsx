import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUser } from '@/api';
import { IUser } from '@/types';

const AddUser: React.FC = () => {
  const [newUser, setNewUser] = useState<IUser>({
    ID: 0,
    CreatedAt: '',
    UpdatedAt: '',
    DeletedAt: '',
    Username: '',
    Email: '',
    Role: '',
    FirstName: '',
    LastName: '',
    Phone: '',
    Company: '',
    Activated: false,
    Status: false,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser({ ...newUser, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser); // Используем функцию для создания нового пользователя
      router.push('/admin/users'); // Перенаправление после успешного создания
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  return (
    <div className="container mx-auto p-2 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Создание нового пользователя</h1>
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
          <input type="text" name="FirstName" value={newUser.FirstName} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Фамилия:</label>
          <input type="text" name="LastName" value={newUser.LastName} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Email:</label>
          <input type="email" name="Email" value={newUser.Email} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Телефон:</label>
          <input type="text" name="Phone" value={newUser.Phone} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Компания:</label>
          <input type="text" name="Company" value={newUser.Company || ''} onChange={handleChange} className="border rounded p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Активирован:</label>
          <input type="checkbox" name="Activated" checked={newUser.Activated} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Статус:</label>
          <input type="checkbox" name="Status" checked={newUser.Status} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Создать</button>
      </form>
    </div>
  );
};

export default AddUser;
