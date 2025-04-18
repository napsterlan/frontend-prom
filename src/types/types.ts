import { ICategory } from "./index";

// Ответ от сервера
export interface IResponse {
    data: ICategory;
    fullPath: string;
    success: boolean;
}

// Данные формы авторизации
export interface IAuthFormData {
    email: string;
    password: string;
    name?: string; // опционально для регистрации
}

// Хлебные крошки
export interface IBreadcrumb {
    label: string;
    href: string;
}

// Состояние хлебных крошек
export interface IBreadcrumbsState {
    currentPath: IBreadcrumb[];
}

// Теги
export interface ITag {
    ID: number | null;
    Name: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
}

// Параметры маршрута
export type NextPageParams = Promise<{
    slug?: string;
    id?: number;    // для [id]
    categoryId?: string; // для [categoryId]
}>;

// Параметры поиска
export type NextSearchParams = Promise<{
    page?: number;
    search?: string;
    category?: string;
    sort?: 'asc' | 'desc';
    filter?: string;
    limit?: string;
    [key: string]: string | string[] | undefined | number;
}>;

// Пропсы страницы
export interface NextPageProps {
    params: NextPageParams;
    searchParams: NextSearchParams;
}