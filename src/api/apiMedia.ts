import { apiClient } from "./apiClient";

// Загрузка файлов
export const uploadFiles = async (files: File[], path: string) => {
    const formData = new FormData();
    
    // Добавляем файлы
    files.forEach((file) => {
        formData.append('files', file);
    });
    
    // Добавляем путь
    formData.append('path', path);
  
    const response = await apiClient.post('/files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
};

// Загрузка изображения
export const uploadImages = async (files: File[], path: string) => {

    const formData = new FormData();

    // Добавляем файлы
    files.forEach((file) => {
        formData.append('files', file);
    });

    // Добавляем путь
    formData.append('path', path);

    const response = await apiClient.post('/images', formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

//Получение изображения по slug
export const getImageBySlug = async (slug: string) => {
    const response = await apiClient.get(`/images/${slug}`);
    return response.data;
};

// удаление файлов и изображений есть в доке, если нужны методы - искать Олега