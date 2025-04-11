// Изображение
export interface IImages {
    ID?: number | null;
    ImageURL: string;
    AltText?: string;
    Order: number;
    ShortURL?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
}

// Группа файлов
export interface IFileGroup {
    title: string;
        files: {
            FileURL: string;
            FileName: string;
            FileType: string;
        }[] | [];
}

// Перетаскиваемое изображение
export interface IDraggableImage {
    ImageURL: string;
    AltText: string;
    Order: number;
    IsNew: boolean;
}

export interface IFile {
    ID?: number | null;
    FileURL: string;
    FileType: string;
    Order: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string;
    FileName: string;
}
