import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import { Category } from '@/types';

export default function CategoryShow() {
    const { user, logout } = useAuth();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const categoryId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getCategory(categoryId);
                setCategory(response.data.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load category');
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchCategory();
        }
    }, [categoryId]);

    return (
        <ProtectedRoute>
            <Head title="View Category" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center space-x-8">
                                <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                                    DeepTech
                                </Link>
                                <div className="flex space-x-4">
                                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        Dashboard
                                    </Link>
                                    <Link href="/categories" className="text-blue-600 font-medium">
                                        Categories
                                    </Link>
                                    <Link href="/products" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        Products
                                    </Link>
                                    <Link href="/transactions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        Transactions
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Welcome, {user?.name || `${user?.first_name} ${user?.last_name}`}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Category Details</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/categories"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Categories
                                        </Link>
                                        {category && (
                                            <Link
                                                href={`/categories/${category.id}/edit`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Category
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                        <p>Error: {error}</p>
                                        <Link
                                            href="/categories"
                                            className="mt-2 inline-block text-red-600 hover:text-red-800 underline"
                                        >
                                            Return to Categories
                                        </Link>
                                    </div>
                                ) : category ? (
                                    <div className="space-y-6">
                                        {/* Category Info Card */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Category ID
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        #{category.id}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Category Name
                                                    </label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {category.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Description
                                                </label>
                                                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                                                    {category.description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timestamps */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Timestamps
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Created At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(category.created_at).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Updated At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(category.updated_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products in this Category (if available) */}
                                        {category.products && category.products.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                    Products in this Category ({category.products.length})
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {category.products.map((product: any) => (
                                                        <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                Stock: {product.stock}
                                                            </p>
                                                            <Link
                                                                href={`/products/${product.id}`}
                                                                className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                                                            >
                                                                View Product →
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        Category not found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}