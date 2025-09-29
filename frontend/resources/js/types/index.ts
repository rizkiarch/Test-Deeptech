export interface User {
    id: number;
    name?: string;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    gender: string;
    email_verified_at?: string;
    created_at: string;
    updated_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy?: {
        url: string;
        port: number | null;
        defaults: Record<string, any>;
        routes: Record<string, any>;
    };
};

export interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    products?: Product[];
}

export interface Product {
    id: number;
    name: string;
    product_name: string;
    description?: string;
    image?: string;
    image_url?: string;
    category_id: number;
    category_name?: string;
    stock: number;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    product_name?: string;
    type: 'stock_in' | 'stock_out';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface CategoryFormData {
    name: string;
    description: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    category_id: number;
    stock: number;
    image?: File;
}

export interface TransactionFormData {
    product_id: number;
    quantity: number;
    type: 'stock_in' | 'stock_out';
    notes?: string;
}

export interface Config {
    [key: string]: any;
}

export interface Errors {
    [key: string]: string;
}

export interface ErrorBag {
    [key: string]: string[];
}

export interface InertiaSharedProps<T = {}> {
    errors: Errors & ErrorBag;
    auth: {
        user: User | null;
    };
    flash?: {
        message?: string;
        error?: string;
        success?: string;
    };
    [key: string]: any;
}