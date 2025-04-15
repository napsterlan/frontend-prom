import { ICategory, IImages, IProjectCategory, IUser } from './index';

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
    RelatedProductCategories: ICategory[] | number[]; // В каких категориях показывать новость
    NewsInProductCategoriesToShow: ICategory[] | number[]; // Какие категории показывать в новости
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    Images?: IImages[] | [];
    FullPath?: string;
    DeletedImages?: number[] | [];
}