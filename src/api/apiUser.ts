import { apiClient } from "./apiClient";

// Создание нового пользователя
export const createUser = async (userData: object) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
};

//Получение профиля текущего пользователя
export const getCurrentUser = async (sessionToken?: string) => {
    try {
        console.log("getCurrentUser called with token:", sessionToken); 
        
        const response = await apiClient.get('/users/profile', {
            headers: sessionToken ? {
                Authorization: `Bearer ${sessionToken}`
            } : {}
        });
        
        // console.log("API response:", response);
        return response.data;
    } catch (error: any) {
        console.log("getCurrentUser error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }
        throw error;
    }
};

//Получение списка менеджеров
export const getManagersList = async () => {
    const response = await apiClient.get('users/managers');
    return response.data;
};

// Список всех пользователей
export const getAllUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data;
};
  
// Получение пользователя по id
export const getUserById = async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
};

// Обновление пользователя по id
export const updateUserById = async (id: number, userData: object) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
};

// Удаление пользователя по id
export const deleteUserById = async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
};