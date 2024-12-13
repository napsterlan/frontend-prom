import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../../api/apiClient';
import { User } from '../../../types/types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data.data);
    };
    fetchUsers();
  }, []);

    const handleEdit = (userId: number) => {
        window.location.href = `/admin/users/edit/${userId}`;
    };


  const handleDelete = async (userId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Обновляем список пользователей после удаления
          setUsers(users.filter(user => user.ID !== userId));
        } else {
          console.error('Ошибка при удалении пользователя');
        }
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
      }
    }
  };


  
  return (
    <div>
      <h1>Список пользователей</h1>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.ID}>
              <td>{user.FirstName}</td>
              <td>{user.LastName}</td>
              <td>{user.Role}</td>
              <td>
                <button onClick={() => handleEdit(user.ID)}>Редактировать</button>
                <button onClick={() => handleDelete(user.ID)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
