import { DollarSign, Plus, ShoppingCart, Tag, XCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



// Mock data for demonstration
const initialInventory = [
    { id: 1, name: 'Paper Towels', category: 'Household', quantity: 4, unit: 'rolls', location: 'Kitchen Cabinet', expiry: '2025-06-15' },
    { id: 2, name: 'Dish Soap', category: 'Cleaning', quantity: 2, unit: 'bottles', location: 'Under Sink', expiry: null },
    { id: 3, name: 'Laundry Detergent', category: 'Cleaning', quantity: 1, unit: 'bottle', location: 'Laundry Room', expiry: '2024-12-10' },
    { id: 4, name: 'Batteries (AA)', category: 'Electronics', quantity: 8, unit: 'pcs', location: 'Utility Drawer', expiry: null },
    { id: 5, name: 'Light Bulbs', category: 'Household', quantity: 6, unit: 'pcs', location: 'Storage Closet', expiry: null },
    { id: 6, name: 'Toothpaste', category: 'Personal Care', quantity: 3, unit: 'tubes', location: 'Bathroom', expiry: '2025-03-22' },
    { id: 7, name: 'Toilet Paper', category: 'Household', quantity: 12, unit: 'rolls', location: 'Bathroom Cabinet', expiry: null },
    { id: 8, name: 'Hand Soap', category: 'Personal Care', quantity: 2, unit: 'bottles', location: 'Bathroom', expiry: '2025-01-15' },
];

const categories = ['All', 'Household', 'Cleaning', 'Personal Care', 'Electronics', 'Food'];
const locations = ['All', 'Kitchen Cabinet', 'Under Sink', 'Laundry Room', 'Utility Drawer', 'Storage Closet', 'Bathroom', 'Bathroom Cabinet'];


const addItem = () => {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState(initialInventory);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Household',
        quantity: 1,
        unit: 'pcs',
        location: 'Kitchen Cabinet',
        expiry: ''
    });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = Math.max(...inventory.map(item => item.id)) + 1;
        setInventory([...inventory, { ...newItem, id: newId, expiry: newItem.expiry || null }]);
        setNewItem({
            name: '',
            category: 'Household',
            quantity: 1,
            unit: 'pcs',
            location: 'Kitchen Cabinet',
            expiry: ''
        });
        toast.success('Item added successfully');
        navigate('/inventory-dash');


    };


    return (
        <div className="container mx-auto px-4 py-6 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
        <button 
          onClick={() => navigate('/add-item')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Item</span>
        </button>
      </div>
            <div className="container mx-auto px-4 py-6 fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    {/* Cards Container */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full" >
                        {/* Card 1 */}
                        <a href="/all-products">
                            <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                                <h2 className="text-xl font-semibold">All Products</h2>
                                <p className="text-gray-600">Details about stock 2.</p>
                            </div>
                        </a>

                        {/* Card 2 */}
                        <a href="">
                            <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                                <DollarSign className="h-8 w-8 text-green-600" />
                                <h2 className="text-xl font-semibold">All products</h2>
                                <p className="text-gray-600">Details about stock 2.</p>
                            </div>
                        </a>

                        {/* Card 3 */}
                        <a href="">
                            <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                                <XCircle className="h-8 w-8 text-red-600" />
                                <h2 className="text-xl font-semibold">Out of stock</h2>
                                <p className="text-gray-600">Details about stock 3.</p>
                            </div>
                        </a>


                        {/* Card 4 */}
                        <a href="">
                            <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                                <Tag className="h-8 w-8 text-yellow-600" />
                                <h2 className="text-xl font-semibold">All Categories</h2>
                                <p className="text-gray-600">Details about stock 4.</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                <form onSubmit={handleAddItem}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                {categories.filter(c => c !== 'All').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    placeholder="unit"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.location}
                                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                            >
                                {locations.filter(l => l !== 'All').map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.expiry}
                                onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

                        >
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default addItem
