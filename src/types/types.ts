import { IProductCategory } from "./index";

// Ответ от сервера
export interface IResponse {
    data: IProductCategory;
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