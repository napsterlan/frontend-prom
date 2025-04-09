import { addAuthHeader, removeAuthHeader, createUser, getAuthToken, login } from "./apiAuth"
import { getCategories, getAllProjectCategories, getProjectCategoryBySlug, createProjectCategory, updateProjectCategoryById, deleteProjectCategoryById, getProductsInCategory } from "./apiCategory"
import { getProductBySlug } from "./apiProduct"
import { getAllNews, getNewsBySlug, createNews, updateNews, deleteNewsById } from "./apiNews"
import { getAllProjects, getProjectBySlug, createProject, updateProjectById, deleteProjectById } from "./apiProject"
import { getAllInfoPages, getInfoPagesById, createInfoPage, updateInfoPageById, deleteInfoPageById } from "./apiInfo"
import { searchFor } from "./apiSearch"
import { uploadFiles, uploadImages, getImageBySlug } from "./apiMedia"
import { getCurrentUser, getManagersList, getAllUsers, getUserById, updateUserById, deleteUserById } from "./apiUser"

export { 
    addAuthHeader,
    removeAuthHeader,
    createUser,
    getAuthToken,
    login,
    getCategories,
    getAllProjectCategories,
    getProjectCategoryBySlug,
    createProjectCategory,
    updateProjectCategoryById,
    deleteProjectCategoryById,
    getProductsInCategory,
    getProductBySlug,
    getAllNews,
    getNewsBySlug,
    createNews,
    updateNews,
    deleteNewsById,
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProjectById,
    deleteProjectById,
    getAllInfoPages,
    getInfoPagesById,
    createInfoPage,
    updateInfoPageById,
    deleteInfoPageById,
    searchFor,
    uploadFiles,
    uploadImages,
    getImageBySlug,
    getCurrentUser,
    getManagersList,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};