import { IImages, IFile, IProject, INews, ITag } from "./index";

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
}

// Продукт
export interface IProduct {
    ID: number;
    ProductID: number;
    Name: string;
    Article: string;
    SKU: string;
    Description: string;
    Price: number;
    OptPrice?: number;
    DealerPrice1?: number;
    DealerPrice2?: number;
    DealerPrice3?: number;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    Status: string;
    FullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Images: IImages[] | [];
    AttributeGroups: IAttributeGroup[] | [];
    Files: IFile[] | [];
    RelatedProjects: IProject[] | [];
    RelatedNews: INews[] | [];
    RelatedProducts: IProduct[] | [];
    Tags: ITag[] | [];
}

interface IAttribute {
    ID: number;
    Name: string;
    Order: number;
    Value: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string;
    AttributeGroupID: number;
}

interface IAttributeGroup {
    ID: number;
    Name: string;
    Order: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string;
    Attributes: IAttribute[] | [];
}

