import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User, Product } from '@/types';
import { useProducts } from '@/hooks/useApi';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/layouts/app/NavHeader';

export default function ProductsIndex() {
    const { user, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { data: products, loading, error, refetch } = useProducts(currentPage, 10);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete product "${name}"?`)) {
            return;
        }

        try {
            setDeleteLoading(id);
            await ApiService.deleteProduct(id);
            setSuccessMessage(`Product "${name}" deleted successfully`);
            refetch();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete product');
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
            <Head title="Products" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Products</h1>
                                    <Link
                                        href="/products/create"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add New Product
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
                                        <p>Error loading products: {error}</p>
                                        <button
                                            onClick={refetch}
                                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Products Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Image
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Category
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Stock
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
                                                    {products?.data?.map((product: Product) => (
                                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {product.image ? (
                                                                    <img
                                                                        src={product.image_url}
                                                                        alt={product.name}
                                                                        className="h-12 w-12 object-cover rounded-md"
                                                                    />
                                                                ) : (
                                                                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                                                                        <span className="text-gray-400 text-xs">No Image</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {product.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                                    {product.description}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {product.category_name || 'No Category'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 0
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                    }`}>
                                                                    {product.stock}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                                {new Date(product.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Link
                                                                        href={`/products/${product.id}`}
                                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link
                                                                        href={`/products/${product.id}/edit`}
                                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id, product.name)}
                                                                        disabled={deleteLoading === product.id}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                                    >
                                                                        {deleteLoading === product.id ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )) || (
                                                            <tr>
                                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                    No products found
                                                                </td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {products?.meta && (
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                                    Showing {((products.meta.current_page - 1) * products.meta.per_page) + 1} to{' '}
                                                    {Math.min(products.meta.current_page * products.meta.per_page, products.meta.total)} of{' '}
                                                    {products.meta.total} results
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={products.meta.current_page === 1}
                                                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                                        Page {products.meta.current_page} of {products.meta.last_page}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, products.meta.last_page))}
                                                        disabled={products.meta.current_page === products.meta.last_page}
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