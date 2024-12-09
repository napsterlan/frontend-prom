import { createContext, useContext, useEffect, useState } from 'react';

const UserIdContext = createContext<string | undefined>(undefined);

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const generateUserId = (): string => {
    const userAgent = navigator.userAgent; // Получаем информацию о пользовательском агенте
    const timestamp = Date.now().toString(); // Текущая метка времени
    return `${userAgent}-${timestamp}`; // Генерация уникального идентификатора на основе данных браузера
  };

  const [userId, setUserId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const existingUserId = localStorage.getItem('userId');
      if (existingUserId) {
        return existingUserId;
      } else {
        const newUserId = generateUserId(); // Используем новую функцию для генерации userId
        localStorage.setItem('userId', newUserId);
        return newUserId;
      }
    }
    return '';
  });

  return (
    <UserIdContext.Provider value={userId}>
      {children}
    </UserIdContext.Provider>
  );
};

export const useUserId = (): string => {
  const context = useContext(UserIdContext);
  if (context === undefined) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
};