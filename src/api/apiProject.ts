import { apiClient } from "./apiClient";

//Получение списка всех проектов
export const getAllProjects = async (page: number = 1, category: string) => {
    const response = await apiClient.get(`/projects?page=${page}&page_size=12&category=${category}`);
    return response.data;
};
  
//Получение информации о конкретном проекте по slug
export const getProjectBySlug = async (slug: string) => {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
};

//Создание нового проекта
export const createProject = async (projectData: object) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
};

//Обновление проекта по id
export const updateProjectById = async (id: number, projectData: object) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
};

//Удаление проекта по id
export const deleteProjectById = async (id: number) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
};
  