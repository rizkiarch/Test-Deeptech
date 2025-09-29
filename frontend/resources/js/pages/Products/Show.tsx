import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import { Product } from '@/types';
import NavHeader from '@/layouts/app/NavHeader';

export default function ProductShow() {
    const { user, logout } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Get product ID from URL
    const productId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getProduct(productId);
                setProduct(response.data.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        if (stock <= 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
        return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
    };

    return (
        <ProtectedRoute>
            <Head title="View Product" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Product Details</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/products"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Products
                                        </Link>
                                        {product && (
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Product
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="space-y-4">
                                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                        <p>Error: {error}</p>
                                        <Link
                                            href="/products"
                                            className="mt-2 inline-block text-red-600 hover:text-red-800 underline"
                                        >
                                            Return to Products
                                        </Link>
                                    </div>
                                ) : product ? (
                                    <div className="space-y-6">
                                        {/* Product Overview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Product Image */}
                                            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-64 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Product ID
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        #{product.id}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Product Name
                                                    </label>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                        {product.name}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Category
                                                    </label>
                                                    <p
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        {product.category_name || 'No Category'}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Stock Status
                                                        </label>
                                                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStockStatus(product.stock).color}`}>
                                                            {getStockStatus(product.stock).text} ({product.stock})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Description */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Description
                                            </h3>
                                            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                                                {product.description || 'No description provided'}
                                            </p>
                                        </div>

                                        {/* Timestamps */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Product Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Created At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(product.created_at).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Updated At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(product.updated_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                                                Quick Actions
                                            </h3>
                                            <div className="flex flex-wrap gap-4">
                                                <Link
                                                    href="/transactions/create"
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    Add Stock Transaction
                                                </Link>
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    Edit Product
                                                </Link>
                                                <Link
                                                    href="/products/create"
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                                >
                                                    Create Similar Product
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        Product not found
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