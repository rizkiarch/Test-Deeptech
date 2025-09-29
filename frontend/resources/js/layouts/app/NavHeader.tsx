import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@inertiajs/react";

export default function NavHeader() {
    const { user, logout } = useAuth();
    return (
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
                            <Link href="/transactions" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                Transactions
                            </Link>
                            <Link href="/users" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                Users
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
    )
}