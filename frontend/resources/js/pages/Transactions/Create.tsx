import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { User, Product, TransactionFormData } from '@/types';
import { useProducts } from '@/hooks/useApi';
import ApiService from '@/services/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function TransactionsCreate() {
    const { user, logout } = useAuth();
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch products for dropdown
    const { data: productsData, loading: productsLoading } = useProducts(1, 100);
    const products = productsData?.data || [];

    const [formData, setFormData] = useState<TransactionFormData>({
        product_id: 0,
        type: 'in',
        quantity: 1,
        amount: undefined,
        description: '',
        transaction_date: new Date().toISOString().split('T')[0], // Today's date
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting || formData.product_id === 0) {
            if (formData.product_id === 0) {
                setErrorMessage('Please select a product');
            }
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage('');
            setErrors({});

            await ApiService.createTransaction(formData);
            setSuccessMessage('Transaction created successfully!');

            // Reset form after successful creation
            setTimeout(() => {
                setFormData({
                    product_id: 0,
                    type: 'in',
                    quantity: 1,
                    amount: undefined,
                    description: '',
                    transaction_date: new Date().toISOString().split('T')[0],
                });
                setSuccessMessage('');
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrorMessage(error.response?.data?.message || 'Failed to create transaction');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    // Get selected product details
    const selectedProduct = products.find((p: Product) => p.id === formData.product_id);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'product_id' || name === 'quantity' ? parseInt(value) || 0 :
                name === 'amount' ? (value ? parseFloat(value) : undefined) : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <ProtectedRoute>
            <Head title="Create Transaction" />

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
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Create New Transaction</h1>
                                    <Link
                                        href="/transactions"
                                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        Back to Transactions
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

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Product Selection */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Product *
                                            </label>
                                            <select
                                                id="product_id"
                                                value={formData.product_id}
                                                onChange={handleInputChange}
                                                disabled={productsLoading}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            >
                                                <option value={0}>
                                                    {productsLoading ? 'Loading products...' : 'Select a product'}
                                                </option>
                                                {products.map((product: Product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} (Stock: {product.stock}) - {product.category?.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.product_id && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product_id}</div>
                                            )}
                                        </div>

                                        {/* Selected Product Info */}
                                        {selectedProduct && (
                                            <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                                    Selected Product Information
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
                                                    <div>
                                                        <span className="font-medium">Name:</span> {selectedProduct.name}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Current Stock:</span> {selectedProduct.stock}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Price:</span> ${selectedProduct.price.toFixed(2)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Category:</span> {selectedProduct.category?.name || 'No Category'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction Type */}
                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Transaction Type *
                                            </label>
                                            <select
                                                id="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            >
                                                <option value="in">Stock In (Increase Stock)</option>
                                                <option value="out">Stock Out (Decrease Stock)</option>
                                            </select>
                                            {errors.type && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</div>
                                            )}
                                        </div>

                                        {/* Quantity */}
                                        <div>
                                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                min="1"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            />
                                            {errors.quantity && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</div>
                                            )}

                                            {/* Stock warning */}
                                            {selectedProduct && formData.type === 'out' && formData.quantity > selectedProduct.stock && (
                                                <div className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                                                    ⚠️ Warning: Quantity exceeds current stock ({selectedProduct.stock})
                                                </div>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Amount (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                id="amount"
                                                step="0.01"
                                                min="0"
                                                value={formData.amount || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                placeholder="0.00"
                                            />
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Total monetary value of this transaction (optional)
                                            </div>
                                            {errors.amount && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</div>
                                            )}
                                        </div>

                                        {/* Transaction Date */}
                                        <div>
                                            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Transaction Date *
                                            </label>
                                            <input
                                                type="date"
                                                id="transaction_date"
                                                value={formData.transaction_date}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                required
                                            />
                                            {errors.transaction_date && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transaction_date}</div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description (Optional)
                                            </label>
                                            <textarea
                                                id="description"
                                                rows={3}
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                                placeholder="Add any notes or description for this transaction..."
                                            />
                                            {errors.description && (
                                                <div className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end space-x-4">
                                        <Link
                                            href="/transactions"
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || formData.product_id === 0}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? 'Creating Transaction...' : 'Create Transaction'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}