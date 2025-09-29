import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User, Transaction } from '@/types';
import { useTransactions } from '@/hooks/useApi';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function TransactionsIndex() {
    const { user, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { data: transactions, loading, error, refetch } = useTransactions(currentPage, 10);

    const handleDelete = async (id: number) => {
        if (!confirm(`Are you sure you want to delete this transaction?`)) {
            return;
        }

        try {
            setDeleteLoading(id);
            await ApiService.deleteTransaction(id);
            setSuccessMessage(`Transaction deleted successfully`);
            refetch();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete transaction');
        } finally {
            setDeleteLoading(null);
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const getTransactionTypeColor = (type: string) => {
        return type === 'in'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    return (
        <ProtectedRoute>
            <Head title="Transactions" />

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
                                    <Link href="/categories" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        Categories
                                    </Link>
                                    <Link href="/products" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        Products
                                    </Link>
                                    <Link href="/transactions" className="text-blue-600 font-medium">
                                        Transactions
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
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
                    </div>
                </nav>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Transactions</h1>
                                    <div className="flex space-x-2">
                                        <Link
                                            href="/transactions/create"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Add New Transaction
                                        </Link>
                                        <Link
                                            href="/transactions/bulk"
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Bulk Transaction
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
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                        <p>Error loading transactions: {error}</p>
                                        <button
                                            onClick={refetch}
                                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Transactions Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Product
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Quantity
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Amount
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {transactions?.data?.map((transaction: Transaction) => (
                                                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {transaction.product?.name || 'Unknown Product'}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {transaction.product?.category?.name || 'No Category'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                                                                    {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {transaction.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {transaction.amount ? `$${transaction.amount.toFixed(2)}` : '-'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                                                                    {transaction.description || '-'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                                {new Date(transaction.transaction_date || transaction.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Link
                                                                        href={`/transactions/${transaction.id}`}
                                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link
                                                                        href={`/transactions/${transaction.id}/edit`}
                                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(transaction.id)}
                                                                        disabled={deleteLoading === transaction.id}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                                    >
                                                                        {deleteLoading === transaction.id ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) || (
                                                            <tr>
                                                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                    No transactions found
                                                                </td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {transactions?.meta && (
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    Showing {((transactions.meta.current_page - 1) * transactions.meta.per_page) + 1} to{' '}
                                                    {Math.min(transactions.meta.current_page * transactions.meta.per_page, transactions.meta.total)} of{' '}
                                                    {transactions.meta.total} results
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={transactions.meta.current_page === 1}
                                                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                                        Page {transactions.meta.current_page} of {transactions.meta.last_page}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, transactions.meta.last_page))}
                                                        disabled={transactions.meta.current_page === transactions.meta.last_page}
                                                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}