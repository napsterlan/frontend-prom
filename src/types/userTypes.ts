// Пользователь
export interface IUser {
    ID?: number;
    Email: string;
    Role?: string;
    PartnerLevel?: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Activated?: boolean;
    Status: boolean;
    ImageURL?: string;
    QRCodeURL?: string;
    Company: ICompany[];
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string;
    Password?: string;
}

export interface IRegistrationUser {
    Email: string;
    Role?: string;
    PartnerLevel?: number;
    FirstName: string;
    LastName: string;
    Phone: string;
    Status: boolean;
    ImageURL?: string;
    QRCodeURL?: string;
    Company: ICompany;
    Password?: string;
}

// Компания пользователя
export interface ICompany {
    ID: number,
    Name?: string,
    INN?: string,
    KPP?: string,
    LegalAddress?: string,
    Users?: IUser[],
    Addresses?: IAddress[],
    FullName?: string,
    Status?: boolean
}

export interface IAddress {
    ID?: number,
    Address?: string,
    Country?: string,
    City?: string,
    Region?: string,
    Company?: ICompany[],
    MainAdress?: number,
}
