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
                                                <h3 className="font-semibold">Service Health</h3>
                                                <p className="text-sm">
                                                    Status: {healthStatus.status === 'success' ? 'Healthy' : 'Unhealthy'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    All Service Is Running
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
