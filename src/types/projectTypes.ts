import { IImages, IUser, IProjectCategory, ICategory } from "./index";

// Проект
export interface IProject {
    ID: number | null;
    Title: string;
    Name: string;
    Description: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    Status: boolean;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    PublishDate: string;
    MainCategoryID: number | null;
    Images?: IImages[] | [];
    ProjectsCategories: IProjectCategory[];
    RelatedProductCategories: ICategory[] | number[]; // В каких категориях показывать портфолио
    ProjectInProductCategoriesToShow: ICategory[] | number[]; // Какие категории показывать в портфолио
    UserID?: number | null;
    User?: IUser | null;
    FullPath?: string;
    DeletedImages?: number[] | [];
}