import { IImages, IProductView, IProject } from "./index";

// Категория
export interface ICategory {
    ID: number,
    CategoryID: number,
    ParentID: number | null,
    Name: string,
    Description?: string,
    SmallDescription?: string,
    MetaTitle?: string,
    MetaDescription?: string,
    MetaKeyword?: string,
    Slug?: string,
    Status: boolean,
    FullPath?: string,
    Order?: number,
    CreatedAt?: string,
    UpdatedAt?: string,
    DeletedAt?: string,
    Parent?: ICategory | null,
    Images?: IImages[] | [],
    Files?: File[] | [],
    ChildrenCategories?: ICategory[] | [],
    ProductView?: IProductView[] | [],
    RelatedProjects?: IProject[] | []
}

// Категория проектов
export interface IProjectCategory {
    ID: number | null;
    Name: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    FullPath: string;
    Status: boolean;
    Order?: number,
    Description: string;
    ProjectCategoryChildren?: {
        ID: number | null;
        Title: string;
        fullPath: string;
    }[] | [];
    Projects?: IProject[] | [];
    Images?: IImages[] | [];
}

export interface ICategoryTreeById {
    ID: number;
    Name: string;
}
