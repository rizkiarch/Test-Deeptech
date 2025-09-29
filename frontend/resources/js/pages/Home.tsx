import { Head, router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Home() {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.visit('/dashboard');
            } else {
                router.visit('/login');
            }
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <>
                <Head title="DeepTech" />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                </div>
            </>
        );
    }

    return null;
}