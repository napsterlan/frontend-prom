import { IImages } from "./index";

// Вид продукта
export interface IProductView {
    ID: number;
    ProductID: number;
    SKU: string;
    Name: string;
    Power: string;
    LuminousFlux: string;
    Efficiency: string;
    ColorTemp: string;
    CRI: string;
    ProtectionClass: string;
    ClimateExecution: string;
    EmergencyPowerUnit: string;
    BeamAngle: string;
    KCC: string;
    Warranty: string;
    Price: number;
    OptPrice?: number;
    DealerPrice1?: number;
    DealerPrice2?: number;
    DealerPrice3?: number;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string | null;
    Images?: string[] | null;
    // ProductAttributes?: any | null;
    // Files?: any | null;
    // RelatedProjects?: any | null;
    // RelatedNews?: any | null;
    // RelatedProducts?: any | null;
    // Tags?: any | null;
}

// Продукт
export interface IProduct {
    ID: number;
    Name: string;
    Article: string;
    SKU: string;
    Description: string;
    Price: number;
    OptPrice?: number;
    DealerPrice1?: number;
    DealerPrice2?: number;
    DealerPrice3?: number;
    Images: IImages[] | null;
    AttributeGroups: [{
        Name: string;
        Order: number;
        Attributes: [{
            Name: string;
            Value: string;
            Order: number;
        }]
    }] 
    Files: {
        FileURL: string;
        FileName: string;
        FileType: string;
    }[] | null;
    RelatedProducts: {
        ID: number;
        Name: string;
        Images: IImages[] | null;
        fullPath: string;
    }[] | null;
    RelatedProjects?: Array<{
        ProjectID: string | number;
        Title: string;
        fullPath: string;
        CreatedAt: string;
        Images: IImages[] | null;
      }>;
    Tags: {
        ID: number;
        Name: string;
    }[] | null;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    FullPath: string;
    Slug: string;
    Status: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}