import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useProducts } from '@/hooks/useApi';
import ApiService from '@/services/api';
import NavHeader from '@/layouts/app/NavHeader';

interface BulkTransactionItem {
    product_id: number;
    quantity: number;
    type: 'stock_in' | 'stock_out';
    notes?: string;
}

export default function TransactionsBulk() {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState<BulkTransactionItem[]>([
        { product_id: 0, quantity: 1, type: 'stock_in', notes: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

    // Fetch products for dropdowns
    const { data: productsData, loading: productsLoading } = useProducts(1, 100);
    const products = productsData?.data || [];

    const addTransaction = () => {
        setTransactions([...transactions, { product_id: 0, quantity: 1, type: 'stock_in', notes: '' }]);
    };

    const removeTransaction = (index: number) => {
        if (transactions.length > 1) {
            const newTransactions = transactions.filter((_, i) => i !== index);
            setTransactions(newTransactions);

            // Remove errors for this index
            const newErrors = { ...errors };
            delete newErrors[index];
            setErrors(newErrors);
        }
    };

    const updateTransaction = (index: number, field: keyof BulkTransactionItem, value: any) => {
        const newTransactions = [...transactions];
        newTransactions[index] = { ...newTransactions[index], [field]: value };
        setTransactions(newTransactions);

        // Clear error for this field
        if (errors[index]?.[field]) {
            const newErrors = { ...errors };
            delete newErrors[index][field];
            setErrors(newErrors);
        }
    };

    const validateTransactions = (): boolean => {
        const newErrors: Record<number, Record<string, string>> = {};
        let hasErrors = false;

        transactions.forEach((transaction, index) => {
            const transactionErrors: Record<string, string> = {};

            if (transaction.product_id === 0) {
                transactionErrors.product_id = 'Please select a product';
                hasErrors = true;
            }

            if (transaction.quantity <= 0) {
                transactionErrors.quantity = 'Quantity must be greater than 0';
                hasErrors = true;
            }

            // Check if product has enough stock for stock_out
            if (transaction.type === 'stock_out') {
                const product = products.find((p: any) => p.id === transaction.product_id);
                if (product && transaction.quantity > product.stock) {
                    transactionErrors.quantity = `Not enough stock. Available: ${product.stock}`;
                    hasErrors = true;
                }
            }

            if (Object.keys(transactionErrors).length > 0) {
                newErrors[index] = transactionErrors;
            }
        });

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTransactions()) {
            setErrorMessage('Please fix the errors before submitting');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Submit each transaction individually
            const promises = transactions.map(transaction =>
                ApiService.createTransaction(transaction)
            );

            await Promise.all(promises);

            setSuccessMessage(`Successfully created ${transactions.length} transactions!`);

            // Reset form after success
            setTimeout(() => {
                setTransactions([{ product_id: 0, quantity: 1, type: 'stock_in', notes: '' }]);
                setSuccessMessage('');
            }, 3000);

        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to create bulk transactions');
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const getSelectedProduct = (productId: number) => {
        return products.find((p: any) => p.id === productId);
    };

    return (
        <ProtectedRoute>
            <Head title="Bulk Transactions" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Bulk Transactions</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/transactions"
                                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            Back to Transactions
                                        </Link>
                                        <Link
                                            href="/transactions/create"
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Single Transaction
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

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        {transactions.map((transaction, index) => (
                                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-medium">
                                                        Transaction #{index + 1}
                                                    </h3>
                                                    {transactions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTransaction(index)}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    {/* Product Selection */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Product *
                                                        </label>
                                                        <select
                                                            value={transaction.product_id}
                                                            onChange={(e) => updateTransaction(index, 'product_id', parseInt(e.target.value))}
                                                            disabled={productsLoading}
                                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 ${errors[index]?.product_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                        >
                                                            <option value={0}>
                                                                {productsLoading ? 'Loading...' : 'Select product'}
                                                            </option>
                                                            {products.map((product: any) => (
                                                                <option key={product.id} value={product.id}>
                                                                    {product.name} (Stock: {product.stock})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[index]?.product_id && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[index].product_id}</p>
                                                        )}
                                                    </div>

                                                    {/* Transaction Type */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Type *
                                                        </label>
                                                        <select
                                                            value={transaction.type}
                                                            onChange={(e) => updateTransaction(index, 'type', e.target.value as 'stock_in' | 'stock_out')}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                        >
                                                            <option value="stock_in">Stock In</option>
                                                            <option value="stock_out">Stock Out</option>
                                                        </select>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Quantity *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={transaction.quantity}
                                                            onChange={(e) => updateTransaction(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 ${errors[index]?.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                                }`}
                                                        />
                                                        {errors[index]?.quantity && (
                                                            <p className="mt-1 text-sm text-red-600">{errors[index].quantity}</p>
                                                        )}
                                                    </div>

                                                    {/* Notes */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Notes
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={transaction.notes || ''}
                                                            onChange={(e) => updateTransaction(index, 'notes', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                            placeholder="Optional notes..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                {transaction.product_id > 0 && (
                                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                                        <div className="text-sm text-blue-800 dark:text-blue-200">
                                                            {(() => {
                                                                const product = getSelectedProduct(transaction.product_id);
                                                                return product ? (
                                                                    <div className="flex justify-between">
                                                                        <span>Current Stock: {product.stock}</span>
                                                                        <span>
                                                                            After Transaction: {
                                                                                transaction.type === 'stock_in'
                                                                                    ? product.stock + transaction.quantity
                                                                                    : product.stock - transaction.quantity
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ) : null;
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            onClick={addTransaction}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Add Another Transaction
                                        </button>

                                        <div className="flex space-x-4">
                                            <Link
                                                href="/transactions"
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? 'Creating Transactions...' : `Create ${transactions.length} Transaction${transactions.length > 1 ? 's' : ''}`}
                                            </button>
                                        </div>
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