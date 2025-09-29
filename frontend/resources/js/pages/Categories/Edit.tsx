import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import { Category, CategoryFormData } from '@/types';
import NavHeader from '@/layouts/app/NavHeader';

export default function CategoryEdit() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState<CategoryFormData>({
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Get category ID from URL
    const categoryId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getCategory(categoryId);
                const category = response.data.data;
                setFormData({
                    name: category.name,
                    description: category.description,
                });
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || 'Failed to load category');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setErrorMessage('');

        try {
            await ApiService.updateCategory(categoryId, formData);
            setSuccessMessage('Category updated successfully!');

            // Redirect after success using Inertia router
            setTimeout(() => {
                router.visit('/categories', { preserveState: false });
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrorMessage(error.response?.data?.message || 'Failed to update category');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <ProtectedRoute>
            <Head title="Edit Category" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Edit Category</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/categories"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Categories
                                        </Link>
                                        <Link
                                            href={`/categories/${categoryId}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View Category
                                        </Link>
                                    </div>
                                </div>

                                {/* Messages */}
                                {successMessage && (
                                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex justify-between">
                                        <span>{successMessage}</span>
                                        <button onClick={clearMessages} className="text-green-500 hover:text-green-700">×</button>
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between">
                                        <span>{errorMessage}</span>
                                        <button onClick={clearMessages} className="text-red-500 hover:text-red-700">×</button>
                                    </div>
                                )}

                                {/* Loading State */}
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                ) : (
                                    /* Form */
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            />
                                            {errors.name && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description *
                                            </label>
                                            <textarea
                                                id="description"
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            />
                                            {errors.description && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</div>
                                            )}
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <Link
                                                href="/categories"
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {submitting ? 'Updating...' : 'Update Category'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}