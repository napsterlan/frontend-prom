import { apiClient } from "./apiClient";

// Получение списка всех категорий
export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data;
};

// Получение информации о конкретной категории по slug
export const getCategoryBySlug = async (slug: string, page_size: number = 10, page: number = 1) => {
    const response = await apiClient.get(`/category/${slug}`, {
        params: { page_size, page }
    });
    return response.data;
};

// Получение списка всех категорий проектов
export const getAllProjectCategories = async () => {
    const response = await apiClient.get('/projects-categories');
    return response.data;
};

// Получение информации о конкретной категории проектов по slug
export const getProjectCategoryBySlug = async (slug: string) => {
    const response = await apiClient.get(`/projects-categories/${slug}`);
    return response.data;
};

// Создание новой категории проектов
export const createProjectCategory = async (categoryData: object) => {
    const response = await apiClient.post('/projects-categories', categoryData);
    return response.data;
};

// Обновление категории проектов по id
export const updateProjectCategoryById = async (id: number, categoryData: object) => {
    const response = await apiClient.put(`/projects-categories/${id}`, categoryData);
    return response.data;
};

// Удаление категории проектов по id
export const deleteProjectCategoryById = async (id: number) => {
    const response = await apiClient.delete(`/projects-categories/${id}`);
    return response.data;
};

// Получение списка продуктов в категории
export const getProductsInCategory = async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};