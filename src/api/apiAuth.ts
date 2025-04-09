import { apiClient } from "./apiClient";

// Добавление авторизационного заголовка
export const addAuthHeader = (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Удаление авторизационного заголовка
export const removeAuthHeader = () => {
    delete apiClient.defaults.headers.common['Authorization'];
};

// Регистрация нового пользователя
export const createUser = async (user: {
    email: string,
    password: string,
    firstName: string
    lastName: string,
    phone: string,
}) => {
    const response = await apiClient.post(`/users`, user)
    return response.data;
};

// получение токена авторизации 
export const getAuthToken = async (email: string, password: string) => {
    const response = await apiClient.post(`/auth/login`, { email, password })
    return response.data;
};

// Callback для NextAuth авторизации
export const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/callback/credentials', { email, password });
      
      // Log the response for debugging
      console.log('Login API response:', response);
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
};

// Выход из системы
export const logout = async () => {
    const response = await apiClient.post('/logout');
    return response.data;
};