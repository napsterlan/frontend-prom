import { IImages, IProjectCategory, IUser } from './index';

// Новость
export interface INews {
    ID: number | null;
    Title: string;
    Name: string;
    Description: string;
    PublishDate: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    Status: boolean;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    MainCategoryID?: number | null;
    ProjectsCategories?: IProjectCategory[] | [];
    Images?: IImages[] | [];
    FullPath?: string;
}