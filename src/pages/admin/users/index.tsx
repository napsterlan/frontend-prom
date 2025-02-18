import React from 'react';
import { deleteUserById, getAllUsers } from '../../../api/apiClient';
import { User } from '../../../types/types';

interface UserListProps {
  users: User[];
}
// Добавлено для получения данных на сервере
export async function getServerSideProps() {
  const data = await getAllUsers();
  return {
    props: {
      users: data.data,
    },
  };
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const handleEdit = (userId: number) => {
    window.location.href = `/admin/users/edit/${userId}`;
  };

  const handleDelete = async (userId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const response = await deleteUserById(userId);

        if (response.success) {
          // Обновляем список пользователей после удаления
          // Здесь нужно будет обновить состояние, если вы используете его
          window.location.reload();
        } else {
          console.error('Ошибка при удалении пользователя');
        }
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Список пользователей</h1>
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => window.history.back()} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
        <button 
          onClick={() => window.location.href = '/admin/users/add'} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Добавить пользователя
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Имя</th>
            <th className="py-3 px-6 text-left">Фамилия</th>
            <th className="py-3 px-6 text-left">Роль</th>
            <th className="py-3 px-6 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map(user => (
            <tr key={user.ID} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6">{user.FirstName}</td>
              <td className="py-3 px-6">{user.LastName}</td>
              <td className="py-3 px-6">{user.Role}</td>
              <td className="py-3 px-6 text-right">
                <button 
                  onClick={() => handleEdit(user.ID)} 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                >
                  Редактировать
                </button>
                <button 
                  onClick={() => handleDelete(user.ID)} 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
