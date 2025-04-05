import { DollarSign, Plus, ShoppingCart, Tag, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

//#region Constants and Configuration
const API_URL = 'http://localhost:8070/api/inventory/';

const CATEGORIES = ['Household', 'Cleaning', 'Personal Care', 'Electronics', 'Food'];
const DEPARTMENTS = ['Kitchen', 'House Keeping', 'Maintenance'];
//#endregion

//#region Types
interface InventoryItem {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    department: string;
    expiry?: string;
    price?: number;
    currency: string;
    threshold: string;
}
//#endregion

const AddItem: React.FC = () => {
    const navigate = useNavigate();

    //#region State
    const [newItem, setNewItem] = useState<InventoryItem>({
        name: '',
        category: 'Household',
        quantity: 1,
        unit: 'pcs',
        price: 0,
        currency: 'LKR',
        department: 'Kitchen Cabinet',
        expiry: '',
        threshold:'',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalStoreValue, setTotalStoreValue] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    //#endregion

    //#region Effects
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(API_URL);
                const inventoryData = response.data;
                setInventory(inventoryData);

                // Derive values for dashboard cards
                setTotalProducts(inventoryData.length);

                const storeValue = inventoryData.reduce((total: number, item: InventoryItem) => {
                    return total + (item.quantity * (item.price || 0));
                }, 0);
                setTotalStoreValue(storeValue);

                const outOfStockCount = inventoryData.filter((item: InventoryItem) => item.quantity === 0).length;
                setOutOfStock(outOfStockCount);

                const uniqueCategories = new Set(inventoryData.map((item: InventoryItem) => item.category));
                setTotalCategories(uniqueCategories.size);
            } catch (err) {
                console.error('Error fetching inventory data:', err);
                toast.error('Failed to fetch inventory data');
            }
        };

        fetchInventory();
    }, []);
    //#endregion

    //#region Handlers
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
        if (newItem.expiry && new Date(newItem.expiry) < new Date()) {
            setError('Expiry date cannot be in the past');
            return;
        }
        if (newItem.price === undefined || newItem.price <= 0) {
            setError('Price must be greater than 0');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(API_URL, {
                itemName: newItem.name,
                category: newItem.category,
                quantity: newItem.quantity,
                unitType: newItem.unit,
                department: newItem.department,
                expiryDate: newItem.expiry || null,
                price: newItem.price,
                currency: newItem.currency,
                threshold: newItem.threshold,
            });

            // Reset form
            setNewItem({
                name: '',
                category: 'Household',
                quantity: 1,
                unit: 'pcs',
                department: DEPARTMENTS[0],
                expiry: '',
                price: 0,
                currency: 'LKR',
                threshold:'',
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof InventoryItem
    ) => {
        const value = e.target.value;
        if (field === 'quantity' || field === 'price') {
            setNewItem({ ...newItem, [field]: parseInt(value) || 0 });
        } else {
            setNewItem({ ...newItem, [field]: value });
        }
    };
    //#endregion

    //#region Render
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
                    <p className="text-gray-600">{totalProducts} items</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                    <h2 className="text-xl font-semibold">Total Store Value</h2>
                    <p className="text-gray-600">{totalStoreValue} LKR</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <XCircle className="h-8 w-8 text-red-600 mb-2" />
                    <h2 className="text-xl font-semibold">Out of Stock</h2>
                    <p className="text-gray-600">{outOfStock} items</p>
                </a>
                <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
                    <Tag className="h-8 w-8 text-yellow-600 mb-2" />
                    <h2 className="text-xl font-semibold">All Categories</h2>
                    <p className="text-gray-600">{totalCategories} categories</p>
                </a>
            </div>

            {/* Add Item Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Add New Item</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
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
                                onChange={(e) => handleInputChange(e, 'name')}
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
                                onChange={(e) => handleInputChange(e, 'category')}
                                disabled={loading}
                            >
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
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
                                    onChange={(e) => handleInputChange(e, 'quantity')}
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.unit}
                                    onChange={(e) => handleInputChange(e, 'unit')}
                                    placeholder="unit"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                                Department
                            </label>
                            <select
                                id="department"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={newItem.department}
                                onChange={(e) => handleInputChange(e, 'department')}
                                disabled={loading}
                            >
                                {DEPARTMENTS.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
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
                                onChange={(e) => handleInputChange(e, 'expiry')}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.price}
                                    onChange={(e) => handleInputChange(e, 'price')}
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.currency}
                                    onChange={(e) => handleInputChange(e, 'currency')}
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.threshold}
                                    onChange={(e) => handleInputChange(e, 'threshold')}
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    value={newItem.unit}
                                    onChange={(e) => handleInputChange(e, 'unit')}
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
    //#endregion
};

export default AddItem;