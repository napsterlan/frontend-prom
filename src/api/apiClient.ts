import axios from 'axios';
import Cookies from 'js-cookie';
import { getSession, signOut } from "next-auth/react"

// let currentSession: any = null;

// export const setCurrentSession = (session: any) => {
//     currentSession = session;
//   };

const getBaseConfig = () => ({
  baseURL: process.env.API_URL || 'http://192.168.31.40:4000/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
  },
  withCredentials: true,
});

const apiClient = axios.create(getBaseConfig());


apiClient.interceptors.request.use(
    async (config) => {
      const session = await getSession()
      if (session?.jwt) {
        config.headers.Authorization = `Bearer ${session.jwt}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

// apiClient.interceptors.request.use(async (config) => {
//     if (currentSession?.jwt) {
//         config.headers.Authorization = `Bearer ${currentSession.jwt}`;
//     }
    
//     return config;
//   })

//   export const clearSessionCache = () => {
//     cachedSession = null;
// };

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log(error);
      if (error.response?.status === 401 && 
        (!error.config.url?.includes('/users/profile') &&
        !error.config.url?.includes('/auth/') || error.response?.data.error === "invalid token")) {
      // Clear the session and redirect to login
      await signOut({ 
        redirect: true, 
        callbackUrl: "/login?error=SessionExpired" 
      })
      }
      return Promise.reject(error)
    }
  )


  export const addAuthHeader = (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };
  
  export const removeAuthHeader = () => {
    delete apiClient.defaults.headers.common['Authorization'];
  };

// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       // Only redirect on 401 errors from non-login/register endpoints
//       if (error.response?.status === 401 && 
//           !['/login', '/register'].includes(error.config.url)) {
//         // Clear stored auth data
//         Cookies.remove('csrf_token');
//         // Let the component handle the redirect
//         throw new Error('Not authenticated');
//       }
//       return Promise.reject(error);
//     }
//   );

export const searchFor = async (query: string, searchType: string, page: number = 1, category: string) => {
  const response = await apiClient.get(`/search?query=${encodeURIComponent(query)}&page=${page}&search_type=${searchType}`);
  return response.data;
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
export const getsInCategory = async (slug: string) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get(`/product/${slug}`);
  return response.data;
};

// Новости
export const getAllNews = async (page: number = 1) => {
  const response = await apiClient.get(`/news?page=${page}&page_size=12`);
  return response.data;
};

export const getNewsBySlug = async (slug: string) => {
  const response = await apiClient.get(`/news/${slug}`);
  return response.data;
};

export const createNews = async (newsData: object) => {
  const response = await apiClient.post('/news', newsData);
  return response.data;
};

export const updateNewsById = async (id: number, newsData: object) => {
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
  console.log(response.status);
  return response.data;
};

export const getProjectCategoryBySlug = async (slug: string) => {
  const response = await apiClient.get(`/projects-categories/${slug}`);
  return response.data;
};

export const createProjectCategory = async (categoryData: object) => {
  const response = await apiClient.post('/projects-categories', categoryData);
  return response.data;
};

export const updateProjectCategoryById = async (id: number, categoryData: object) => {
  const response = await apiClient.put(`/projects-categories/${id}`, categoryData);
  return response.data;
};

export const deleteProjectCategoryById = async (id: number) => {
  const response = await apiClient.delete(`/projects-categories/${id}`);
  return response.data;
};

// Проекты
export const getAllProjects = async (page: number = 1, category: string) => {
  const response = await apiClient.get(`/projects?page=${page}&page_size=12&category=${category}`);
  return response.data;
};

export const getProjectBySlug = async (slug: string) => {
  const response = await apiClient.get(`/projects/${slug}`);
  return response.data;
};

export const createProject = async (projectData: object) => {
  const response = await apiClient.post('/projects', projectData);
  return response.data;
};

export const updateProjectById = async (id: number, projectData: object) => {
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

export const createInfoPage = async (pageData: object) => {
  const response = await apiClient.post('/info-pages', pageData);
  return response.data;
};

export const updateInfoPageById = async (id: number, pageData: object) => {
  const response = await apiClient.put(`/info-pages/${id}`, pageData);
  return response.data;
};

export const deleteInfoPageById = async (id: number) => {
  const response = await apiClient.delete(`/info-pages/${id}`);
  return response.data;
};

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

export const logout = async () => {
  const response = await apiClient.post('/logout');
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

export const createUser = async (userData: object) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const updateUserById = async (id: number, userData: object) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUserById = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

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
    } catch (error) {
        console.log("getCurrentUser error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }
        throw error;
    }
};

// Загрузка файлов
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

export default apiClient;