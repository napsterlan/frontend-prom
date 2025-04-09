// Изображение
export interface IImages {
    ID: number;
    ImageURL: string;
    AltText: string;
    Order: number;
    ShortURL?: string;
}

// Группа файлов
export interface IFileGroup {
    title: string;
    files: {
        FileURL: string;
        FileName: string;
        FileType: string;
    }[];
}

// Перетаскиваемое изображение
export interface IDraggableImage {
    ImageURL: string;
    AltText: string;
    Order: number;
    isNew: boolean;
}