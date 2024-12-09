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
    CategoryImages: {
        image_url: string;
        alt_text: string;
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
    ProductAttributes?: any | null;
    Files?: any | null;
    RelatedProjects?: any | null;
    RelatedNews?: any | null;
    RelatedProducts?: any | null;
    Tags?: any | null;
}

export interface Response {
    data: Category;
    fullPath: string;
    success: boolean;
}

export interface Product {
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
    Images: {
        ImageURL: string;
        AltText: string;
    }[] | null;
    ProductAttributes: ProductAttribute[] | null;
    ProductFiles: {
        FileURL: string;
        FileName: string;
    }[] | null;
    RelatedProjects: {
        ProjectID: number;
        Title: string;
        ProjectImages: {
            ImageURL: string;
            altText: string;
        }[];
        fullPath: string;
    }[] | null;
    RelatedNews: {
        NewsID: number;
        Title: string;
        NewsImages: {
            ImageURL: string;
            altText: string;
        }[];
        fullPath: string;
    }[] | null;
    RelatedProducts: {
        ProductID: number;
        Name: string;
        ProductImages: {
            ImageURL: string;
            altText: string;
        }[];
        fullPath: string;
    }[] | null;
    Tags: {
        TagID: number;
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

export interface ProductAttribute {
    AttributeID: number;
    AttributeName: string;
    AttributeGroupName: string;
    Value: string;
}

export interface ProjectCategory {
    ProjectCategoryID: number;
    Title: string;
    Description: string;
    ProjectCategoryChildren: {
        ProjectCategoryID: number;
        Title: string;
        fullPath: string;
    }[];
    Projects: {
        ProjectID: number;
        Title: string;
        ProjectImages: {
            ImageURL: string;
            AltText: string;
        }[];
        fullPath: string;
    }[];
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    fullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}

export interface Project {
    ProjectID: number;
    Title: string;
    Description: string;
    ProjectsCategories: {
        CategoryID: number;
        Name: string;
    }[];
    RelatedProducts: {
        ProductID: number;
        Name: string;
        ProductImages: {
            ImageURL: string;
            AltText: string;
        }[];
        fullPath: string;
    }[];
    RelatedNews: {
        NewsID: number;
        Title: string;
        NewsImages: {
            ImageURL: string;
            AltText: string;
        }[];
        fullPath: string;
    }[];
    ProjectImages: {
        ImageURL: string;
        AltText: string;
    }[];
    MetaTitle: string;
    MetaDescription: string;
    MetaKeyword: string;
    fullPath: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}

export interface Breadcrumb {
    label: string;
    href: string;
}

export interface BreadcrumbsState {
    currentPath: Breadcrumb[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
}

export interface AuthFormData {
    email: string;
    password: string;
    name?: string; // опционально для регистрации
}

export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    Slug: string;
}