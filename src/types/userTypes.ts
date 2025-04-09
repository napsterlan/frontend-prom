// Пользователь
export interface IUser {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Username: string;
    Email: string;
    Role: string;
    FirstName: string;
    LastName: string;
    Phone: string;
    Activated: boolean;
    Status: boolean;
    Company: string | null;
    ImageURL?: string | null;
    QRCodeURL?: string | null;
}