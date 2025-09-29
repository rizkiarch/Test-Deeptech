import { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';
import { User } from '@/types';

interface AppLayoutProps extends PropsWithChildren {
    user?: User | null;
    title?: string;
    description?: string;
}

export default function AppLayout({
    children,
    user,
    title = 'DeepTech Frontend',
    description = 'Laravel React Frontend with Microservices'
}: AppLayoutProps) {
    return (
        <>
            <Head title={title}>
                <meta name="description" content={description} />
            </Head>

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Navigation */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        DeepTech
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {user ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Welcome, {user.name}
                                        </span>
                                        <form method="POST" action="/logout" className="inline">
                                            <button
                                                type="submit"
                                                className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
                                            >
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <a
                                            href="/login"
                                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Login
                                        </a>
                                        <a
                                            href="/register"
                                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                        >
                                            Register
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main>
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                © 2025 DeepTech Frontend. Powered by Laravel & React.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}