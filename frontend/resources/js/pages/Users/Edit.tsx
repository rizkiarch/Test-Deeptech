import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import NavHeader from '@/layouts/app/NavHeader';

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    gender: string;
    created_at: string;
}

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    gender: string;
}

interface FormErrors {
    first_name?: string;
    last_name?: string;
    email?: string;
    birth_date?: string;
    gender?: string;
    general?: string;
}

export default function UserEdit() {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
        gender: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [fetchError, setFetchError] = useState<string | null>(null);

    const userId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setFetchLoading(true);
                const response = await ApiService.get(`/v1/users/${userId}`);
                const user = response.data;
                setUserData(user);
                setFormData({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    birth_date: user.birth_date,
                    gender: user.gender
                });
                setFetchError(null);
            } catch (error: any) {
                setFetchError(error.response?.data?.message || 'Failed to fetch user');
            } finally {
                setFetchLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await ApiService.put(`/v1/users/${userId}`, formData);
            setSuccessMessage('User updated successfully!');

            setTimeout(() => {
                router.visit('/users', { preserveState: false });
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: error.response?.data?.message || 'Failed to update user' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (fetchLoading) {
        return (
            <ProtectedRoute>
                <Head title="Loading..." />
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    <NavHeader />
                    <div className="py-12">
                        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="animate-pulse">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (fetchError) {
        return (
            <ProtectedRoute>
                <Head title="Error" />
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    <NavHeader />
                    <div className="py-12">
                        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                        <p>Error: {fetchError}</p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href="/users"
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            ← Back to Users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Head title={`Edit User - ${formData.first_name} ${formData.last_name}`} />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Edit User</h1>
                                    <Link
                                        href="/users"
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        ← Back to Users
                                    </Link>
                                </div>

                                {successMessage && (
                                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                        {successMessage}
                                    </div>
                                )}

                                {errors.general && (
                                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                        {errors.general}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="first_name"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                required
                                            />
                                            {errors.first_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                required
                                            />
                                            {errors.last_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Birth Date *
                                            </label>
                                            <input
                                                type="date"
                                                id="birth_date"
                                                name="birth_date"
                                                value={formData.birth_date}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.birth_date ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                required
                                            />
                                            {errors.birth_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Gender *
                                            </label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.gender ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="laki-laki">Laki-laki</option>
                                                <option value="perempuan">Perempuan</option>
                                            </select>
                                            {errors.gender && (
                                                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-4">
                                        <Link
                                            href="/users"
                                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? 'Updating...' : 'Update User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}