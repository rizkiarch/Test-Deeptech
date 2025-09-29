import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            withCredentials: true,
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');
                console.log('API Request:', config.method?.toUpperCase(), config.url);
                console.log('Token exists:', !!token);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                console.log('API Response:', response.status, response.config.url);
                console.log('Response data:', response.data);
                return response;
            },
            (error) => {
                console.error('API Error:', error.response?.status, error.config?.url);
                console.error('Error details:', error.response?.data);
                if (error.response?.status === 401) {
                    console.log('Unauthorized - removing token and redirecting to login');
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async login(email: string, password: string): Promise<AxiosResponse> {
        return this.api.post('/v1/auth/login', { email, password });
    }

    async logout(): Promise<AxiosResponse> {
        return this.api.post('/v1/auth/logout');
    }

    async getProfile(): Promise<AxiosResponse> {
        return this.api.get('/v1/auth/profile');
    }

    async getUsers(page: number = 1, limit: number = 10): Promise<AxiosResponse> {
        return this.api.get(`/v1/users?page=${page}&limit=${limit}`);
    }

    async getUser(id: number): Promise<AxiosResponse> {
        return this.api.get(`/v1/users/${id}`);
    }

    async createUser(userData: any): Promise<AxiosResponse> {
        return this.api.post('/v1/users', userData);
    }

    async updateUser(id: number, userData: any): Promise<AxiosResponse> {
        return this.api.put(`/v1/users/${id}`, userData);
    }

    async deleteUser(id: number): Promise<AxiosResponse> {
        return this.api.delete(`/v1/users/${id}`);
    }

    // Category methods
    async getCategories(page: number = 1, limit: number = 10): Promise<AxiosResponse> {
        return this.api.get(`/v1/categories?page=${page}&limit=${limit}`);
    }

    async getCategory(id: number): Promise<AxiosResponse> {
        return this.api.get(`/v1/categories/${id}`);
    }

    async createCategory(categoryData: any): Promise<AxiosResponse> {
        return this.api.post('/v1/categories', categoryData);
    }

    async updateCategory(id: number, categoryData: any): Promise<AxiosResponse> {
        return this.api.put(`/v1/categories/${id}`, categoryData);
    }

    async deleteCategory(id: number): Promise<AxiosResponse> {
        return this.api.delete(`/v1/categories/${id}`);
    }

    // Product methods
    async getProducts(page: number = 1, limit: number = 10): Promise<AxiosResponse> {
        return this.api.get(`/v1/products?page=${page}&limit=${limit}`);
    }

    async getProduct(id: number): Promise<AxiosResponse> {
        return this.api.get(`/v1/products/${id}`);
    }

    async getProductsByCategory(categoryId: number): Promise<AxiosResponse> {
        return this.api.get(`/v1/products/category/${categoryId}`);
    }

    async createProduct(productData: FormData): Promise<AxiosResponse> {
        return this.api.post('/v1/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async updateProduct(id: number, productData: FormData): Promise<AxiosResponse> {
        return this.api.put(`/v1/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async deleteProduct(id: number): Promise<AxiosResponse> {
        return this.api.delete(`/v1/products/${id}`);
    }

    async getTransactions(page: number = 1, limit: number = 10): Promise<AxiosResponse> {
        return this.api.get(`/v1/transactions?page=${page}&limit=${limit}`);
    }

    async getTransaction(id: number): Promise<AxiosResponse> {
        return this.api.get(`/v1/transactions/${id}`);
    }

    async createTransaction(transactionData: any): Promise<AxiosResponse> {
        return this.api.post('/v1/transactions', transactionData);
    }

    async updateTransaction(id: number, transactionData: any): Promise<AxiosResponse> {
        return this.api.put(`/v1/transactions/${id}`, transactionData);
    }

    async deleteTransaction(id: number): Promise<AxiosResponse> {
        return this.api.delete(`/v1/transactions/${id}`);
    }

    async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse> {
        const formData = new FormData();
        formData.append('file', file);

        return this.api.post('/v1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });
    }

    async healthCheck(): Promise<AxiosResponse> {
        return this.api.get('/health');
    }

    async get(endpoint: string, params?: any): Promise<AxiosResponse> {
        return this.api.get(endpoint, { params });
    }

    async post(endpoint: string, data?: any): Promise<AxiosResponse> {
        return this.api.post(endpoint, data);
    }

    async put(endpoint: string, data?: any): Promise<AxiosResponse> {
        return this.api.put(endpoint, data);
    }

    async delete(endpoint: string): Promise<AxiosResponse> {
        return this.api.delete(endpoint);
    }
}

export default new ApiService();