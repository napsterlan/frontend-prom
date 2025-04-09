import { apiClient } from "./apiClient";

// Получение списка всех информационных страниц
export const getAllInfoPages = async () => {
    const response = await apiClient.get('/info-pages');
    return response.data;
};

// Получение информации о конкретной странице по id
export const getInfoPagesById = async (id: number) => {
    const response = await apiClient.get(`/info-pages${id}`);
    return response.data;
};

// Создание новой информационной страницы
export const createInfoPage = async (pageData: object) => {
    const response = await apiClient.post('/info-pages', pageData);
    return response.data;
};

// Обновление информационной страницы по id
export const updateInfoPageById = async (id: number, pageData: object) => {
    const response = await apiClient.put(`/info-pages/${id}`, pageData);
    return response.data;
};

// Удаление информационной страницы по id
export const deleteInfoPageById = async (id: number) => {
    const response = await apiClient.delete(`/info-pages/${id}`);
    return response.data;
};