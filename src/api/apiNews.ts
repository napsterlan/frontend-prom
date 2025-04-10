import { apiClient } from "./apiClient";
import { INews } from "@/types";

// Получение списка всех новостей
export const getAllNews = async (page: number = 1) => {
    const response = await apiClient.get(`/news?page=${page}&page_size=12`);
    return response.data;
};

// Получение информации о конкретной новости по slug
export const getNewsBySlug = async (slug: string) => {
    const response = await apiClient.get(`/news/${slug}`);
    return response.data;
};

// создание новости
export const createNews = async (newsData: INews) => {
    const response = await apiClient.post(`/news`, newsData)
    return response.data;
};

// обновление новости
export const updateNews = async (id: number, newsData: INews) => {
    const response = await apiClient.put(`/news/${id}`, newsData)
    return response.data;
};

// удаление новости
export const deleteNewsById = async (id: number) => {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
};