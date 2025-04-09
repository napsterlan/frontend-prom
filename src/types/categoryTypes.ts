import { IImages, IProductView, IProject } from "./index";

// Продуктовая категория
export interface IProductCategory {
    ID: number;
    CategoryID: number;
    ParentID: number | null;
    Name: string;
    Description: string;
    SmallDescription: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    Status: boolean;
    FullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Images: IImages[] | [];
    ChildrenCategories: IProductCategory[] | [];
    ProductView: IProductView[] | [];
    File: File[] | [];
    Order: number;
    Parent: IProductCategory | null;
    RelatedProjects: IProject[] | [];
}

// Категория проектов
export interface IProjectCategory {
    ID: number;
    Name: string;
    Description: string;
    ProjectCategoryChildren: {
        ID: number;
        Title: string;
        fullPath: string;
    }[];
    Images: IImages[] | [];
    Projects: {
        ID: number;
        Title: string;
        Images: IImages[] | [];
        Slug: string;
    }[];
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    fullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Slug: string;
}

