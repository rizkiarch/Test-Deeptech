import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ApiService from '@/services/api';
import { Transaction } from '@/types';
import NavHeader from '@/layouts/app/NavHeader';

export default function TransactionShow() {
    const { user, logout } = useAuth();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Get transaction ID from URL
    const transactionId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getTransaction(transactionId);
                setTransaction(response.data.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load transaction');
            } finally {
                setLoading(false);
            }
        };

        if (transactionId) {
            fetchTransaction();
        }
    }, [transactionId]);

    const getTransactionTypeColor = (type: string) => {
        return type === 'in'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    const getTransactionTypeIcon = (type: string) => {
        return type === 'in' ? '↗️' : '↙️';
    };

    return (
        <ProtectedRoute>
            <Head title="View Transaction" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Transaction Details</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/transactions"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Transactions
                                        </Link>
                                        {transaction && (
                                            <Link
                                                href={`/transactions/${transaction.id}/edit`}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Transaction
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
                                            href="/transactions"
                                            className="mt-2 inline-block text-red-600 hover:text-red-800 underline"
                                        >
                                            Return to Transactions
                                        </Link>
                                    </div>
                                ) : transaction ? (
                                    <div className="space-y-6">
                                        {/* Transaction Overview */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    Transaction Overview
                                                </h3>
                                                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                                    {getTransactionTypeIcon(transaction.type)} {transaction.type === 'stock_in' ? 'Stock In' : 'Stock Out'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Transaction ID
                                                    </label>
                                                    <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                                                        #{transaction.id}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Quantity
                                                    </label>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                        {transaction.quantity}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Transaction Date
                                                    </label>
                                                    <p className="text-lg text-gray-900 dark:text-gray-100">
                                                        {new Date(transaction.created_at || transaction.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Information */}
                                        {transaction.product && (
                                            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                    Product Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Product Name
                                                        </label>
                                                        <Link
                                                            href={`/products/${transaction.product.id}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                                                        >
                                                            {transaction.product?.product_name}
                                                        </Link>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Category
                                                        </label>
                                                        <p
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            {transaction.product.category_name || 'No Category'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Current Stock
                                                        </label>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {transaction.product.stock}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Unit Price
                                                        </label>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            Not available
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Description
                                            </h3>
                                            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                                                {transaction.notes || 'No Notes provided'}
                                            </p>
                                        </div>

                                        {/* Timestamps */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Record Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Created At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(transaction.created_at).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Updated At
                                                    </label>
                                                    <p className="text-gray-900 dark:text-gray-100">
                                                        {new Date(transaction.updated_at).toLocaleString()}
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
                                                    Create New Transaction
                                                </Link>
                                                {transaction.product && (
                                                    <Link
                                                        href={`/products/${transaction.product.id}`}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                    >
                                                        View Product
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/transactions/${transaction.id}/edit`}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                                >
                                                    Edit Transaction
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        Transaction not found
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