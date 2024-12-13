import React from 'react';
import { deleteUserById, getAllUsers } from '../../../api/apiClient';
import { User } from '../../../types/types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Список пользователей</h1>
      <ul>
        {users.map(user => (
          <li key={user.ID}>
            {user.FirstName} {user.LastName} - {user.Email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
