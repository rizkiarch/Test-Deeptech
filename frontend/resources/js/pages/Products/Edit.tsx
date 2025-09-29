import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import { Product, ProductFormData, Category } from '@/types';
import { useCategories } from '@/hooks/useApi';
import NavHeader from '@/layouts/app/NavHeader';

export default function ProductEdit() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category_id: 0,
        stock: 0,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Get product ID from URL
    const productId = parseInt(window.location.pathname.split('/')[2]);

    // Fetch categories for dropdown
    const { data: categoriesData, loading: categoriesLoading } = useCategories(1, 100);
    const categories = categoriesData?.data || [];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getProduct(productId);
                const product = response.data.data;
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    category_id: product.category_id || 0,
                    stock: product.stock || 0,
                });
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setErrorMessage('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category_id', formData.category_id.toString());
            formDataToSend.append('stock', formData.stock.toString());

            await ApiService.updateProduct(productId, formDataToSend);
            setSuccessMessage('Product updated successfully!');

            // Redirect after success
            setTimeout(() => {
                window.location.href = '/products';
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrorMessage(error.response?.data?.message || 'Failed to update product');
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
            <Head title="Edit Product" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Edit Product</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/products"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Products
                                        </Link>
                                        <Link
                                            href={`/products/${productId}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            View Product
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
                                        <div className="space-y-4">
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Form */
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Product Name *
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
                                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Category *
                                                </label>
                                                <select
                                                    id="category_id"
                                                    value={formData.category_id}
                                                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                                                    disabled={categoriesLoading}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                    required
                                                >
                                                    <option value={0}>
                                                        {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                                                    </option>
                                                    {categories.map((category: Category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && (
                                                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_id}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Stock Quantity *
                                                </label>
                                                <input
                                                    type="number"
                                                    id="stock"
                                                    min="0"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                    required
                                                />
                                                {errors.stock && (
                                                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</div>
                                                )}
                                            </div>


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
                                                href="/products"
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={submitting || formData.category_id === 0}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {submitting ? 'Updating...' : 'Update Product'}
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