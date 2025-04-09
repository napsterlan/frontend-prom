import { IImages, IUser } from "./index";

// Проект
export interface IProject {
    ID: number;
    Title: string;
    Name: string;
    Description: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    ProjectsCategories: {
        ID: number;
        Name: string;
        Slug: string;
    }[];
    MainCategoryID: number | null;
    Slug: string;
    Images: IImages[] | null;
    User: IUser | null;
    RelatedProducts: {
        ID: number;
        Name: string;
        Images: IImages[] | null;
        fullPath: string;
    }[];
    RelatedNews: {
        ID: number;
        Title: string;
        Images: IImages[] | null;
        fullPath: string;
    }[];
    ProjectImages: Array<{
        ID: number;
        Images: IImages[] | null;
    }>;
    fullPath: string;
    FullPath: string;
    Status: boolean;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PublishDate?: string | null;
}

// Данные формы проекта
export interface IProjectFormData {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    ProjectCategories: {
        CategoryID: number;
        Name: string; 
    }[];
    Slug: string;
    relatedProducts: { 
        ProductID: number; 
        Name: string; 
        ProductImages: { 
            ImageURL: string; 
            AltText: string; 
        }[]; 
        fullPath: string; 
    }[];
    existingImages: {
        ID: number;
        ImageURL: string;
        AltText: string;
    }[];
    newImages: File[];
    deletedImageIds: number[];
}