import { IImages } from './index';

// Новость
export interface INews {
    ID: number;
    Title: string;
    Name: string;
    Description: string;
    Images: IImages[] | null;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    FullPath: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PublishDate?: string | null;
}

// Данные новости
export interface INewsData {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    slug: string;
    existingImages: IImages[];
    newImages: File[];
    deletedImageIds: number[];
} 