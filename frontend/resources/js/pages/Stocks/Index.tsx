import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import NavHeader from '@/layouts/app/NavHeader';

interface Stock {
    id: number;
    name: string;
    category: string;
    quantity: number;
    price: number;
    description: string;
    created_at: string;
}

export default function StocksIndex() {
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 0,
        price: 0,
        description: ''
    });

    // Static stock data
    const [stocks, setStocks] = useState<Stock[]>([
        {
            id: 1,
            name: 'T-Shirt Cotton',
            category: 'Clothing',
            quantity: 150,
            price: 25.99,
            description: 'High quality cotton t-shirt',
            created_at: '2024-01-15T10:30:00Z'
        },
        {
            id: 2,
            name: 'Wireless Headphones',
            category: 'Electronics',
            quantity: 75,
            price: 89.99,
            description: 'Bluetooth wireless headphones with noise cancellation',
            created_at: '2024-01-16T14:20:00Z'
        },
        {
            id: 3,
            name: 'Coffee Mug',
            category: 'Kitchenware',
            quantity: 200,
            price: 12.50,
            description: 'Ceramic coffee mug with custom design',
            created_at: '2024-01-17T09:15:00Z'
        },
        {
            id: 4,
            name: 'Notebook',
            category: 'Stationery',
            quantity: 300,
            price: 5.99,
            description: 'Spiral bound notebook with lined pages',
            created_at: '2024-01-18T11:45:00Z'
        },
        {
            id: 5,
            name: 'Running Shoes',
            category: 'Sports',
            quantity: 50,
            price: 79.99,
            description: 'Comfortable running shoes for daily exercise',
            created_at: '2024-01-19T16:30:00Z'
        }
    ]);

    // Handlers
    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleAdd = () => {
        setFormData({
            name: '',
            category: '',
            quantity: 0,
            price: 0,
            description: ''
        });
        setShowAddModal(true);
    };

    const handleEdit = (stock: Stock) => {
        setSelectedStock(stock);
        setFormData({
            name: stock.name,
            category: stock.category,
            quantity: stock.quantity,
            price: stock.price,
            description: stock.description
        });
        setShowEditModal(true);
    };

    const handleDelete = (stock: Stock) => {
        setSelectedStock(stock);
        setShowDeleteModal(true);
    };

    const submitAdd = () => {
        if (!formData.name || !formData.category) {
            setErrorMessage('Please fill in all required fields');
            return;
        }

        const newStock: Stock = {
            id: Math.max(...stocks.map(s => s.id)) + 1,
            name: formData.name,
            category: formData.category,
            quantity: formData.quantity,
            price: formData.price,
            description: formData.description,
            created_at: new Date().toISOString()
        };

        setStocks([...stocks, newStock]);
        setSuccessMessage(`Stock "${formData.name}" added successfully`);
        setShowAddModal(false);
        clearForm();
    };

    const submitEdit = () => {
        if (!selectedStock || !formData.name || !formData.category) {
            setErrorMessage('Please fill in all required fields');
            return;
        }

        const updatedStocks = stocks.map(stock =>
            stock.id === selectedStock.id
                ? { ...stock, ...formData }
                : stock
        );

        setStocks(updatedStocks);
        setSuccessMessage(`Stock "${formData.name}" updated successfully`);
        setShowEditModal(false);
        clearForm();
    };

    const confirmDelete = () => {
        if (!selectedStock) return;

        const updatedStocks = stocks.filter(stock => stock.id !== selectedStock.id);
        setStocks(updatedStocks);
        setSuccessMessage(`Stock "${selectedStock.name}" deleted successfully`);
        setShowDeleteModal(false);
        setSelectedStock(null);
    };

    const clearForm = () => {
        setFormData({
            name: '',
            category: '',
            quantity: 0,
            price: 0,
            description: ''
        });
        setSelectedStock(null);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        clearForm();
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
                                    <h1 className="text-2xl font-bold">Stock Management</h1>
                                    <button
                                        onClick={handleAdd}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add New Stock
                                    </button>
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

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Price
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
                                            {stocks.length > 0 ? stocks.map((stock) => (
                                                <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {stock.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {stock.category}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {stock.quantity}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            ${stock.price.toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                                                            {stock.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(stock.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(stock)}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(stock)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                        No stocks found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New Stock</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        placeholder="Enter stock name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Kitchenware">Kitchenware</option>
                                        <option value="Stationery">Stationery</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Books">Books</option>
                                        <option value="Home & Garden">Home & Garden</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        rows={3}
                                        placeholder="Enter description"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Add Stock
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedStock && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Stock</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        placeholder="Enter stock name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">Select category</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Kitchenware">Kitchenware</option>
                                        <option value="Stationery">Stationery</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Books">Books</option>
                                        <option value="Home & Garden">Home & Garden</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        rows={3}
                                        placeholder="Enter description"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Stock
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && selectedStock && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Delete</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Are you sure you want to delete <strong>"{selectedStock.name}"</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeModals}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}