import { DollarSign, Plus, ShoppingCart, Tag, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// API Configuration
const API_URL = 'http://localhost:8070/api/inventory/';

// Constants
const categories = ['Household', 'Cleaning', 'Personal Care', 'Electronics', 'Food'];
const departments = ['Kitchen', 'House Keping', 'Maintenence'];

// Types
interface InventoryItem {
    price: number ;
    currency: string  ;
    _id?: string;
    itemName: string;
    category: string;
    quantity: number;
    unitType: string;
    department: string;
    expiryDate?: string;
}

const UpdateItem = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get ID from URL params
    
    const [item, setItem] = useState<InventoryItem>({
        itemName: '',
        category: 'Household',
        quantity: 1,
        unitType: 'pcs',
        department: 'Kitchen Cabinet',
        expiryDate: '',
        price: 0 ,
        currency: 'LKR'  
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch item data when component mounts
    useEffect(() => {
        if (id) {
            fetchItem(id);
        }
    }, [id]);

    const fetchItem = async (itemId: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}${itemId}`);
            const fetchedItem = response.data;
            setItem({
                itemName: fetchedItem.itemName || '',
                category: fetchedItem.category || 'Household',
                quantity: fetchedItem.quantity || 1,
                unitType: fetchedItem.unitType || 'pcs',
                department: fetchedItem.department || 'Kitchen Cabinet',
                expiryDate: fetchedItem.expiryDate ? fetchedItem.expiryDate.split('T')[0] : '',
                price: fetchedItem.price || 0,
                currency: fetchedItem.currency || 'LKR',
            });
        } catch (err) {
            setError('Failed to load item data');
            toast.error('Failed to load item data');
            console.error('Error fetching item:', err);
        } finally {
            setLoading(false);
        }
    };

    // Form submission handler
    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!item.itemName.trim()) {
            setError('Item name is required');
            return;
        }
        if (item.quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        if (!item.unitType.trim()) {
            setError('Unit is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // API call to update item in database
            await axios.put(`${API_URL}${id}`, {
                itemName: item.itemName,
                category: item.category,
                quantity: item.quantity,
                unitType: item.unitType,
                department: item.department,
                expiryDate: item.expiryDate || null
            });

            toast.success('Item updated successfully');
            navigate('/all-products');
        } catch (err) {
            setError('Failed to update item. Please try again.');
            console.error('Error updating item:', err);
            toast.error('Failed to update item');
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

            {/* Update Item Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Update Item</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {loading && !item.itemName ? (
                    <div className="text-center py-4">Loading item data...</div>
                ) : (
                    <form onSubmit={handleUpdateItem}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={item.itemName}
                                    onChange={(e) => setItem({ ...item, itemName: e.target.value })}
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
                                    value={item.category}
                                    onChange={(e) => setItem({ ...item, category: e.target.value })}
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
                                        value={item.quantity}
                                        onChange={(e) => setItem({ ...item, quantity: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        required
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        value={item.unitType}
                                        onChange={(e) => setItem({ ...item, unitType: e.target.value })}
                                        placeholder="unit"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                                    department
                                </label>
                                <select
                                    id="department"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={item.department}
                                    onChange={(e) => setItem({ ...item, department: e.target.value })}
                                    disabled={loading}
                                >
                                    {departments.map(department => (
                                        <option key={department} value={department}>{department}</option>
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
                                    value={item.expiryDate}
                                    onChange={(e) => setItem({ ...item, expiryDate: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={item.price}
                                    onChange={(e) =>
                                        setItem({ ...item, price: parseInt(e.target.value) })
                                    }
                                    
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={item.currency}
                                    onChange={(e) => setItem({ ...item, currency: e.target.value })}
                                    placeholder="unit"
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                                onClick={() => navigate('/all-products')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Item'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateItem;