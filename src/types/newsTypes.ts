import { IImages, IUser } from './index';

// Новость
export interface INews {
    ID?: number | null;
    Title?: string;
    Name?: string;
    Description: string;
    PublishDate?: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    Images?: IImages[] | [];
    UserID?: number | null;
    User?: IUser | null;
    FullPath?: string;
}