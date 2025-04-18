export interface IDadataAddress {
    value: string;
    unrestricted_value: string;
    data: {
        postal_code: string;
        country: string;
        city: string;
        street: string;
        region: string;
        settlement?: string;
        house?: string;
        flat?: string;
        // ... другие поля по необходимости
    };
}

export interface IDadataCompany {
    value: string;
    unrestricted_value: string;
    data: {
        name: { full: string; short: string };
        inn: string;
        kpp: string;
        address: { value: string };
        // ... другие поля по необходимости
    };
}

export interface IDadataSuggestion<T> {
    suggestions: T[];
}

  export interface SearchSuggestion<T> {
    data: T;
    value: string;
}

