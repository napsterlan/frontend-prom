export interface Category {
    ID: number;
    CategoryID: number;
    ParentID: number | null;
    Name: string;
    Description: string;
    SmallDescription: string;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    Slug: string;
    Status: boolean;
    FullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Images: {
        ID: number;
        ImageURL: string;
        AltText: string;
        Order: number;
    }[] | null;
    ChildrenCategories: Category[] | null;
    ProductView: ProductView[] | null;
}

export interface ProductView {
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

export interface Response {
    data: Category;
    fullPath: string;
    success: boolean;
}

export interface Product {
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
    Images: {
        ID: number;
        ImageURL: string;
        AltText: string;
        Order: number;
    }[] | null;
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
        Images: {
            ID: number;
            ImageURL: string;
            AltText: string;
            Order: number;
        }[];
        fullPath: string;
    }[] | null;
    RelatedProjects?: Array<{
        ProjectID: string | number;
        Title: string;
        fullPath: string;
        CreatedAt: string;
        Images?: Array<{
          ImageURL: string;
          AltText?: string;
        }>;
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



export interface ProjectCategory {
    ID: number;
    Name: string;
    Description: string;
    ProjectCategoryChildren: {
        ID: number;
        Title: string;
        fullPath: string;
    }[];
    Images: {
        ID: number;
        ImageURL: string;
        AltText: string;
        Order: number;
    }[];
    Projects: {
        ID: number;
        Title: string;
        Images: {
            ID: number;
            ImageURL: string;
            AltText: string;
            Order: number;
        }[];
        Slug: string;
    }[];
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    fullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Slug: string;
}

export interface Project {
    ID: number;
    Title: string;
    Description: string;
    Images: {
        ID: number;
        ImageURL: string;
        AltText: string;
        Order: number;
    }[];
    ProjectsCategories: {
        ID: number;
        Name: string;
        Slug: string;
    }[];
    RelatedProducts: {
        ID: number;
        Name: string;
        Images: {
            ID: number;
            ImageURL: string;
            AltText: string;
            Order: number;
        }[];
        fullPath: string;
    }[];
    RelatedNews: {
        ID: number;
        Title: string;
        Images: {
            ID: number;
            ImageURL: string;
            AltText: string;
            Order: number;
        }[];
        fullPath: string;
    }[];
    ProjectImages: Array<{
        ID: number;
        Images: Array<{
            ID: number;
            ImageURL: string;
            AltText: string;
            Order: number;
        }>;
    }>;
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    fullPath: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PublishDate?: string | null;
}

export interface News {
    ID: number;
    Title: string;
    Name: string;
    Description: string;
    Images: {
        ID: number;
        ImageURL: string;
        AltText: string;
        Order: number;
    }[];
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    FullPath: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    PublishDate?: string | null;
}

export interface ProjectFormData {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    ProjectCategories: { CategoryID: number; Name: string; }[];
    Slug: string;
    relatedProducts: { 
        ProductID: number; 
        Name: string; 
        ProductImages: { 
            ImageURL: string; 
            AltText: string; 
        }[]; 
        fullPath: string; 
    }[];
    existingImages: {
        ID: number;
        ImageURL: string;
        AltText: string;
    }[];
    newImages: File[];
    deletedImageIds: number[];
}

export interface Breadcrumb {
    label: string;
    href: string;
}

export interface BreadcrumbsState {
    currentPath: Breadcrumb[];
}

export interface User {
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
}

export interface AuthFormData {
    email: string;
    password: string;
    name?: string; // опционально для регистрации
}

export interface DraggableImage {
    ImageURL: string;
    AltText: string;
    Order: number;
    isNew: boolean;
}

export interface DraggableProjectCategory {
    ID: number;
    Name: string;
    Images: DraggableImage[];
}

export interface DraggableProject {
    ID: number;
    Title: string;
    Images: DraggableImage[];
}

export interface FileGroup {
    title: string;
    files: {
        FileURL: string;
        FileName: string;
        FileType: string;
    }[];
}
