import { ICompany } from "@/types/userTypes";
import { apiClient } from "./apiClient";

export const getAllCompanies = async ({
        page, 
        pageSize, 
        searchQuery,
        sessionToken
    }: {
        page?: number, 
        pageSize?: number, 
        searchQuery?: string,
        sessionToken?: string
}) => {
    try {
        const response = await apiClient.get(`/companies?query=${searchQuery}&page=${page}&page_size=${pageSize}`, {
            headers: sessionToken ? {
                Authorization: `Bearer ${sessionToken}`
            } : {}
        });
        return response.data;
    } catch (error: any) {
        console.log("getAllCompanies error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }
        throw error;
    }
};

export const getCompanyById = async ({id, sessionToken}: {id: number, sessionToken: string}) => {
    const response = await apiClient.get(`/companies/${id}`, {
        headers: sessionToken ? {
            Authorization: `Bearer ${sessionToken}`
        } : {}
    });
    return response.data;
};

export const createCompany = async (company: ICompany) => {
    const response = await apiClient.post(`/companies`, company);
    return response.data;
};

export const updateCompanyById = async (id: number, company: ICompany) => {
    const response = await apiClient.patch(`/companies/${id}`, company);
    return response.data;
};

export const deleteCompanyById = async (id: number) => {
    const response = await apiClient.delete(`/companies/${id}`);
    return response.data;
};



