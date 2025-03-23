import { DollarSign, Plus, ShoppingCart, Tag, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// API Configuration
const API_URL = 'http://localhost:8070/api/inventory/';

// Constants
const categories = ['Household', 'Cleaning', 'Personal Care', 'Electronics', 'Food'];
const locations = ['Kitchen Cabinet', 'Under Sink', 'Laundry Room', 'Utility Drawer', 'Storage Closet', 'Bathroom', 'Bathroom Cabinet'];

// Types
interface InventoryItem {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    location: string;
    expiry?: string;
}

const AddItem = () => {
    const navigate = useNavigate();
    
    const [newItem, setNewItem] = useState<InventoryItem>({
        name: '',
        category: 'Household',
        quantity: 1,
        unit: 'pcs',
        location: 'Kitchen Cabinet',
        expiry: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form submission handler
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!newItem.name.trim()) {
            setError('Item name is required');
            return;
        }
        if (newItem.quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        if (!newItem.unit.trim()) {
            setError('Unit is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // API call to save item to database
            const response = await axios.post(API_URL, {
                itemName: newItem.name,
                category: newItem.category,
                quantity: newItem.quantity,
                unitType: newItem.unit,
                location: newItem.location,
                expiryDate: newItem.expiry || null
            });

            // Reset form
            setNewItem({
                name: '',
                category: 'Household',
                quantity: 1,
                unit: 'pcs',
                location: 'Kitchen Cabinet',
               
            });

            toast.success('Item added successfully');
            navigate('/inventory-dash');
        } catch (err) {
            setError('Failed to add item. Please try again.');
            console.error('Error adding item:', err);
            toast.error('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    // Render
    return (
        <div className="container mx-auto px-4 py-6 fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
                <button
                    onClick={() => navigate('/inventory-dash')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
                    disabled={loading}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    <span>View Inventory</span>
                </button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <a href="/all-products" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
                    <h2 className="text-xl font-semibold">Total Products</h2>
                    <p className="text-gray-600">View your shopping list</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                    <h2 className="text-xl font-semibold">Total Store Value</h2>
                    <p className="text-gray-600">Check inventory value</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <XCircle className="h-8 w-8 text-red-600 mb-2" />
                    <h2 className="text-xl font-semibold">Out of Stock</h2>
                    <p className="text-gray-600">View low stock items</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <Tag className="h-8 w-8 text-yellow-600 mb-2" />
                    <h2 className="text-xl font-semibold">All Categories</h2>
                    <p className="text-gray-600">Browse by category</p>
                </a>
            </div>

            {/* Add Item Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddItem}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                Item Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                required
                                disabled={loading}
                                placeholder="Enter item name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                disabled={loading}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                    min="1"
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    placeholder="unit"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                                Location
                            </label>
                            <select
                                id="location"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={newItem.location}
                                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                disabled={loading}
                            >
                                {locations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiry">
                                Expiry Date (Optional)
                            </label>
                            <input
                                type="date"
                                id="expiry"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={newItem.expiry}
                                onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => navigate('/inventory-dash')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;