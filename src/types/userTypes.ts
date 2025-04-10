// Пользователь
export interface IUser {
    ID?: number;
    Username?: string;
    Email: string;
    Role?: string;
    PartnerLevel?: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Activated?: boolean;
    Status?: boolean;
    ImageURL?: string;
    QRCodeURL?: string;
    Company?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    Password?: string;
}

// Компания пользователя
export interface ICompany {
    ID: number,
    Name: string,
    INN: string,
    KPP: string,
    LegalAddress: string,
    Users: IUser[] | []
}