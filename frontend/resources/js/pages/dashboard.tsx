import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/layouts/app/NavHeader';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [users, setUsers] = useState<any>(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState<string | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await ApiService.healthCheck();
                setHealthStatus(response.data);
            } catch (error) {
                console.error('Health check failed:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                setUsersLoading(true);
                const response = await ApiService.getUsers(1, 5);
                setUsers(response.data);
                setUsersError(null);
            } catch (error: any) {
                console.error('Failed to fetch users:', error);
                setUsersError(error.response?.data?.message || 'Failed to fetch users');
            } finally {
                setUsersLoading(false);
            }
        };

        checkHealth();
        fetchUsers();

        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ProtectedRoute>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <NavHeader />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                                {/* Health Status */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Services Health Status</h2>
                                    {healthStatus ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div
                                                className={`p-4 rounded-lg ${healthStatus.status === 'success'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                    }`}
                                            >
                                                <h3 className="font-semibold">User Service</h3>
                                                <p className="text-sm">
                                                    Status: {healthStatus.status === 'success' ? 'Healthy' : 'Unhealthy'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {healthStatus.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Last checked: {new Date(healthStatus.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-pulse">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Users Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
                                    {usersLoading ? (
                                        <div className="animate-pulse">
                                            <div className="space-y-3">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : usersError ? (
                                        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
                                            <p>Error loading users: {usersError}</p>
                                            <p className="text-sm mt-1">Make sure the User Service is running and accessible.</p>
                                        </div>
                                    ) : users ? (
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="space-y-3">
                                                {users.data?.map((user: any) => (
                                                    <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded">
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                                        </div>
                                                        <span className="text-sm text-gray-500">ID: {user.id}</span>
                                                    </div>
                                                )) || <p>No users found</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No user data available</p>
                                    )}
                                </div>

                                {/* Quick Actions Section */}
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        <a
                                            href="/categories"
                                            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                                        >
                                            Manage Categories
                                        </a>

                                        <a
                                            href="/products"
                                            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                                        >
                                            Manage Products
                                        </a>

                                        <a
                                            href="/transactions"
                                            className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors text-center font-medium"
                                        >
                                            Manage Transactions
                                        </a>

                                        <a
                                            href="/categories/create"
                                            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
                                        >
                                            Add Category
                                        </a>

                                        <a
                                            href="/products/create"
                                            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                                        >
                                            Add Product
                                        </a>

                                        <a
                                            href="/transactions/create"
                                            className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors text-center font-medium"
                                        >
                                            Add Transaction
                                        </a>
                                    </div>
                                </div>

                                {/* API Test Section */}
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-4">API Test</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await ApiService.get('/v1/users');
                                                    console.log('Users API Response:', response.data);
                                                    alert('Check console for Users API response');
                                                } catch (error) {
                                                    console.error('Users API Error:', error);
                                                    alert('Users API call failed - check console');
                                                }
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Test Users API
                                        </button>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await ApiService.get('/v1/categories');
                                                    console.log('Categories API Response:', response.data);
                                                    alert('Check console for Categories API response');
                                                } catch (error) {
                                                    console.error('Categories API Error:', error);
                                                    alert('Categories API call failed - check console');
                                                }
                                            }}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Test Categories API
                                        </button>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await ApiService.get('/v1/products');
                                                    console.log('Products API Response:', response.data);
                                                    alert('Check console for Products API response');
                                                } catch (error) {
                                                    console.error('Products API Error:', error);
                                                    alert('Products API call failed - check console');
                                                }
                                            }}
                                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                        >
                                            Test Products API
                                        </button>
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
