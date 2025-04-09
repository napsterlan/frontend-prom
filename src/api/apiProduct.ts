import { apiClient } from "./apiClient";
  
// Получение продукта по slug
export const getProductBySlug = async (slug: string) => {
    const response = await apiClient.get(`/product/${slug}`);
    return response.data;
};