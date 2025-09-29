import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User } from '@/types';
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

export default function UserShow() {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = parseInt(window.location.pathname.split('/')[2]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getUser(userId);
                setUserData(response.data?.data);
                setError(null);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) {
        return (
            <ProtectedRoute>
                <Head title="Loading User..." />
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    <NavHeader />
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="animate-pulse">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <Head title="Error" />
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    <NavHeader />
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                        <p>Error: {error}</p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href="/users"
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            ← Back to Users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!userData) {
        return (
            <ProtectedRoute>
                <Head title="User Not Found" />
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                    <NavHeader />
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <p className="text-gray-500 dark:text-gray-400">User not found.</p>
                                    <div className="mt-4">
                                        <Link
                                            href="/users"
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            ← Back to Users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Head title={`${userData.first_name} ${userData.last_name} - User Details`} />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">User Details</h1>
                                    <div className="flex space-x-4">
                                        <Link
                                            href="/users"
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            ← Back to Users
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                                Personal Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Full Name
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                        {userData.first_name} {userData.last_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Email Address
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                        {userData.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Birth Date
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                        {new Date(userData.birth_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Gender
                                                    </label>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${userData.gender === 'laki-laki'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
                                                        }`}>
                                                        {userData.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                                Account Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        User ID
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-100 font-mono">
                                                        #{userData.id}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Account Created
                                                    </label>
                                                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                        {new Date(userData.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-4">
                                    <Link
                                        href={`/users/${userData.id}/edit`}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Edit User
                                    </Link>
                                    <Link
                                        href="/users"
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}