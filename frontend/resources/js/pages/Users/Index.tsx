import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User } from '@/types';
import { useUsers } from '@/hooks/useApi';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
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

export default function UsersIndex() {
    const { user, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { data: users, loading, error, refetch } = useUsers(currentPage, 10);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete user "${name}"?`)) {
            return;
        }

        try {
            setDeleteLoading(id);
            await ApiService.deleteUser(id);
            setSuccessMessage(`User "${name}" deleted successfully`);
            refetch();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to delete user');
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
            <Head title="Users" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Users Management</h1>
                                    <Link
                                        href="/users/create"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add New User
                                    </Link>
                                </div>

                                {successMessage && (
                                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex justify-between items-center">
                                        <span>{successMessage}</span>
                                        <button onClick={clearMessages} className="text-green-700 hover:text-green-900">×</button>
                                    </div>
                                )}

                                {errorMessage && (
                                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex justify-between items-center">
                                        <span>{errorMessage}</span>
                                        <button onClick={clearMessages} className="text-red-700 hover:text-red-900">×</button>
                                    </div>
                                )}

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
                                        <p>Error loading users: {error}</p>
                                    </div>
                                ) : users && users.data && users.data.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Gender
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Birth Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Created At
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {users.data.map((userData: UserData) => (
                                                    <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {userData.first_name} {userData.last_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {userData.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userData.gender === 'laki-laki'
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                    : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                                                                }`}>
                                                                {userData.gender}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {new Date(userData.birth_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {new Date(userData.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                            <Link
                                                                href={`/users/${userData.id}`}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={`/users/${userData.id}/edit`}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(userData.id, `${userData.first_name} ${userData.last_name}`)}
                                                                disabled={deleteLoading === userData.id}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                            >
                                                                {deleteLoading === userData.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
                                        <Link
                                            href="/users/create"
                                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Create First User
                                        </Link>
                                    </div>
                                )}

                                {users && users.meta && (
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Showing {users.meta.from || 0} to {users.meta.to || 0} of {users.meta.total || 0} users
                                        </div>
                                        <div className="flex space-x-2">
                                            {users.meta.prev_page_url && (
                                                <button
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                >
                                                    Previous
                                                </button>
                                            )}
                                            {users.meta.next_page_url && (
                                                <button
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                >
                                                    Next
                                                </button>
                                            )}
                                        </div>
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