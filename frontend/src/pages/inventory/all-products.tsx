import { ArrowUpDown, Download, Edit, Filter, Package, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import InventoryReport from './../../components/InventoryReport'; // Adjust the path based on your file structure

// API Configuration
const API_URL = 'http://localhost:8070/api/inventory/';

// Constants
const categories = ['All', 'Household', 'Cleaning', 'Personal Care', 'Electronics', 'Food'];
const departments = ['All', 'Kitchen Cabinet', 'Under Sink', 'Laundry Room', 'Utility Drawer', 'Storage Closet', 'Bathroom', 'Bathroom Cabinet'];


// Types
interface InventoryItem {
    _id: string;
    itemName: string;
    category: string;
    quantity: number;
    unitType: string;
    department: string;
    expiryDate?: string;
    updatedAt?: string;
}

const AllProducts = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [sortField, setSortField] = useState<keyof InventoryItem>('itemName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    // API Calls
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get<InventoryItem[]>(API_URL);
            setInventory(response.data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to fetch inventory' });
            console.error("Error fetching inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}${itemToDelete}`);
            setInventory(inventory.filter(item => item._id !== itemToDelete));
            toast.success('Item Deleted successfully');
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete item' });
            console.error("Error deleting item:", err);
        } finally {
            setShowDeleteDialog(false);
            setItemToDelete(null);
            setLoading(false);
        }
    };

    const handleUpdateItem = async (updatedItem: InventoryItem) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_URL}${updatedItem._id}`, updatedItem);
            setInventory(inventory.map(item =>
                item._id === updatedItem._id ? response.data : item
            ));
            setMessage({ type: 'success', text: 'Item updated successfully' });
            setEditingItem(null);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update item' });
            console.error("Error updating item:", err);
        } finally {
            setLoading(false);
        }
    };

    // Sorting Handler
    const handleSort = (field: keyof InventoryItem) => {
        setSortField(field);
        setSortDirection(prev => sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc');
    };

    // Filter and Sort Logic
    const filteredInventory = inventory
        .filter(item =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'All' || item.category === selectedCategory) &&
            (selectedDepartment === 'All' || item.department === selectedDepartment)
        )
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (!aValue) return sortDirection === 'asc' ? 1 : -1;
            if (!bValue) return sortDirection === 'asc' ? -1 : 1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === 'asc'
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        });
        

    // Render
    return (
        <div className="container mx-auto px-4 py-6 fade-in">
            {/* Message Toast */}
            {message && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {message.text}
                    <button className="ml-2" onClick={() => setMessage(null)}>×</button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
                <div className='flex space-x-2'>
                <InventoryReport inventory={filteredInventory} />
                <button
                    onClick={() => navigate('/add-item')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center transition shadow-sm"
                    disabled={loading}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                        <Search className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-transparent border-none outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            disabled={loading}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            disabled={loading}
                        >
                            {departments.map(department => (
                                <option key={department} value={department}>{department}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-right text-gray-500">
                        {filteredInventory.length} items found
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['itemName', 'category', 'quantity', 'department', 'expiryDate'].map(field => (
                                            <th
                                                key={field}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort(field as keyof InventoryItem)}
                                            >
                                                <div className="flex items-center">
                                                    {field.charAt(0).toUpperCase() + field.slice(1).replace('Date', ' Date')}
                                                    {sortField === field && <ArrowUpDown className="h-4 w-4 ml-1" />}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.itemName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.quantity} {item.unitType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    onClick={() => navigate(`/update-item/${item._id}`)}
                                                    disabled={loading}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => {
                                                        setItemToDelete(item._id);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredInventory.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No items found. Try adjusting your filters or add new items.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this item?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                onClick={handleDeleteItem}
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Edit Item</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateItem(editingItem);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                    <input
                                        type="text"
                                        value={editingItem.itemName}
                                        onChange={(e) => setEditingItem({ ...editingItem, itemName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={editingItem.category}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        {categories.slice(1).map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        value={editingItem.quantity}
                                        onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit Type</label>
                                    <input
                                        type="text"
                                        value={editingItem.unitType}
                                        onChange={(e) => setEditingItem({ ...editingItem, unitType: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        value={editingItem.department}
                                        onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        {departments.slice(1).map(department => (
                                            <option key={department} value={department}>{department}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={editingItem.expiryDate?.split('T')[0] || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => setEditingItem(null)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProducts;