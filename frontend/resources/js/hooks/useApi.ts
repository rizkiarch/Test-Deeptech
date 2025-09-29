import { useState, useEffect } from 'react';
import ApiService from '@/services/api';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    refetch: () => Promise<void>;
}

export function useApi<T = any>(
    endpoint: string,
    immediate: boolean = true
): UseApiReturn<T> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const fetchData = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.get(endpoint);
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'An error occurred',
                loading: false
            }));
        }
    };

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [endpoint, immediate]);

    return {
        ...state,
        refetch: fetchData,
    };
}

export function useUsers(page: number = 1, limit: number = 10) {
    const [state, setState] = useState<UseApiState<any>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchUsers = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.getUsers(page, limit);
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Failed to fetch users',
                loading: false
            }));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    return {
        ...state,
        refetch: fetchUsers,
    };
}

export function useCategories(page: number = 1, limit: number = 10) {
    const [state, setState] = useState<UseApiState<any>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchCategories = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.getCategories(page, limit);
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            console.error('Categories fetch error:', error);
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Failed to fetch categories',
                loading: false
            }));
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, limit]);

    return {
        ...state,
        refetch: fetchCategories,
    };
}

export function useProducts(page: number = 1, limit: number = 10) {
    const [state, setState] = useState<UseApiState<any>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchProducts = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.getProducts(page, limit);
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Failed to fetch products',
                loading: false
            }));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, limit]);

    return {
        ...state,
        refetch: fetchProducts,
    };
}

export function useTransactions(page: number = 1, limit: number = 10) {
    const [state, setState] = useState<UseApiState<any>>({
        data: null,
        loading: true,
        error: null,
    });

    const fetchTransactions = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.getTransactions(page, limit);
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Failed to fetch transactions',
                loading: false
            }));
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, limit]);

    return {
        ...state,
        refetch: fetchTransactions,
    };
} export function useAuth() {
    const [state, setState] = useState<UseApiState<any>>({
        data: null,
        loading: true,
        error: null,
    });

    const login = async (email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.login(email, password);

            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
            }

            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));

            return response.data;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Login failed',
                loading: false
            }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await ApiService.logout();
            localStorage.removeItem('auth_token');
            setState({ data: null, loading: false, error: null });
        } catch (error: any) {
            localStorage.removeItem('auth_token');
            setState({ data: null, loading: false, error: null });
        }
    };

    const checkAuth = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await ApiService.getProfile();
            setState(prev => ({
                ...prev,
                data: response.data,
                loading: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || error.message || 'Auth check failed',
                loading: false
            }));
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            checkAuth();
        } else {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    return {
        ...state,
        login,
        logout,
        checkAuth,
    };
}