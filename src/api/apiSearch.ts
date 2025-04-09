import { apiClient } from "./apiClient";

// Поиск по запросу
export const searchFor = async (query: string, searchType: string, page: number = 1, category: string) => {
    const response = await apiClient.get(`/search?query=${encodeURIComponent(query)}&page=${page}&search_type=${searchType}`);
    return response.data;
}

//  query - Поисковый запрос
//  page - Номер страницы (по умолчанию: 1)
//  page_size - Количество элементов на странице (по умолчанию: 10)
//  filters - Фильтры в формате JSON:
//      {
//          "power": string[],
//          "luminous_flux": string[],
//          "color_temperature": string[],
//          "CRI": string[],
//          "IP": string[],
//          "climatic_category": string[],
//          "mounting_type": string[],
//          "warranty": string[]
//      }