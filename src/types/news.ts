import { Images } from './types';

export interface INews {
    ID: number;
    Title: string;
    Name: string;
    Description: string;
    Images: Images[] | null;
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

export interface INewsData {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    slug: string;
    existingImages: Images[];
    newImages: File[];
    deletedImageIds: number[];
} 