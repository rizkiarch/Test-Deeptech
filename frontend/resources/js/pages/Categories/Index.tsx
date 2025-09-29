import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User, Category } from '@/types';
import { useCategories } from '@/hooks/useApi';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/layouts/app/NavHeader';

export default function CategoriesIndex() {
    const { user, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { data: categories, loading, error, refetch } = useCategories(currentPage, 10);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
            return;
        }

        try {
            setDeleteLoading(id);
            await ApiService.deleteCategory(id);
            setSuccessMessage(`Category "${name}" deleted successfully`);
            refetch();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setDeleteLoading(null);
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    return (
        <ProtectedRoute>
            <Head title="Categories" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Categories</h1>
                                    <Link
                                        href="/categories/create"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add New Category
                                    </Link>
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
                                        <p>Error loading categories: {error}</p>
                                        <button
                                            onClick={refetch}
                                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Categories Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Created At
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {categories?.data?.map((category: Category) => (
                                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {category.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                                                                    {category.description}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                                {new Date(category.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Link
                                                                        href={`/categories/${category.id}/edit`}
                                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(category.id, category.name)}
                                                                        disabled={deleteLoading === category.id}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                                    >
                                                                        {deleteLoading === category.id ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) || (
                                                            <tr>
                                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                    No categories found
                                                                </td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {categories?.meta && (
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    Showing {((categories.meta.current_page - 1) * categories.meta.per_page) + 1} to{' '}
                                                    {Math.min(categories.meta.current_page * categories.meta.per_page, categories.meta.total)} of{' '}
                                                    {categories.meta.total} results
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={categories.meta.current_page === 1}
                                                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                                        Page {categories.meta.current_page} of {categories.meta.last_page}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, categories.meta.last_page))}
                                                        disabled={categories.meta.current_page === categories.meta.last_page}
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