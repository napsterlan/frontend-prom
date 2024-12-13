import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://192.168.31.40:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для добавления токена в заголовки
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Категории
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const getCategoryBySlug = async (slug: string, page_size: number = 10, page: number = 1) => {
  const response = await apiClient.get(`/category/${slug}`, {
    params: { page_size, page }
  });
  return response.data;
};

// Продукты
export const getProductsInCategory = async (slug: string) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/product/${slug}`);
  return response.data;
};

// Новости
export const getAllNews = async () => {
  const response = await apiClient.get('/news');
  return response.data;
};

export const getNewsBySlug = async (slug: string) => {
  const response = await apiClient.get(`/news/${slug}`);
  return response.data;
};

export const createNews = async (newsData: any) => {
  const response = await apiClient.post('/news', newsData);
  return response.data;
};

export const updateNewsById = async (id: number, newsData: any) => {
  const response = await apiClient.put(`/news/${id}`, newsData);
  return response.data;
};

export const deleteNewsById = async (id: number) => {
  const response = await apiClient.delete(`/news/${id}`);
  return response.data;
};

// Категории проектов
export const getAllProjectCategories = async () => {
  const response = await apiClient.get('/projects-categories');
  return response.data;
};

export const getProjectCategoryBySlug = async (slug: string) => {
  const response = await apiClient.get(`/projects-categories/${slug}`);
  return response.data;
};

export const getProjectCategoryById = async (id: number) => {
  const response = await apiClient.get(`/projects-categories/${id}`);
  return response.data;
};

export const createProjectCategory = async (categoryData: any) => {
  const response = await apiClient.post('/projects-categories', categoryData);
  return response.data;
};

export const updateProjectCategoryById = async (id: number, categoryData: any) => {
  const response = await apiClient.put(`/projects-categories/${id}`, categoryData);
  return response.data;
};

export const deleteProjectCategoryById = async (id: number) => {
  const response = await apiClient.delete(`/projects-categories/${id}`);
  return response.data;
};

// Проекты
export const getAllProjects = async () => {
  const response = await apiClient.get('/projects');
  return response.data;
};

export const getProjectBySlug = async (slug: string) => {
  const response = await apiClient.get(`/projects/${slug}`);
  return response.data;
};

export const getProjectById = async (id: number) => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: any) => {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
};

export const updateProjectById = async (id: number, projectData: any) => {
  const response = await apiClient.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProjectById = async (id: number) => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};

// Информационные страницы
export const getAllInfoPages = async () => {
  const response = await apiClient.get('/info-pages');
  return response.data;
};

export const getInfoPageBySlug = async (slug: string) => {
  const response = await apiClient.get(`/info-pages/${slug}`);
  return response.data;
};

export const createInfoPage = async (pageData: any) => {
  const response = await apiClient.post('/info-pages', pageData);
  return response.data;
};

export const updateInfoPageById = async (id: number, pageData: any) => {
  const response = await apiClient.put(`/info-pages/${id}`, pageData);
  return response.data;
};

export const deleteInfoPageById = async (id: number) => {
  const response = await apiClient.delete(`/info-pages/${id}`);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/login', {
    email,
    password
  });
  return response.data;
};

// Пользователи
export const getAllUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUserById = async (id: number, userData: any) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserById = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
