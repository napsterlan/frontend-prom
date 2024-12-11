import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserById } from '../../../api/apiClient';
import { User } from '../../../types/types';

const UserDetail: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const data = await getUserById(Number(id));
        setUser(data);
      };
      fetchUser();
    }
  }, [id]);

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Детали пользователя</h1>
      <p>Имя: {user.FirstName} {user.LastName}</p>
      <p>Email: {user.Email}</p>
      <p>Телефон: {user.Phone}</p>
      <p>Активирован: {user.Activated ? 'Да' : 'Нет'}</p>
      <p>Статус: {user.Status ? 'Активен' : 'Отключен'}</p>
    </div>
  );
};

export default UserDetail;
