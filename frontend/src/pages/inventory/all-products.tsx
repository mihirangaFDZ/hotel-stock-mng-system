import { ArrowUpDown, Edit, Filter, Package, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

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


const allProducts = () => {
    const [inventory, setInventory] = useState(initialInventory);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
  

    const navigate = useNavigate();

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDeleteItem = (id: number) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const filteredInventory = inventory
        .filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'All' || item.category === selectedCategory) &&
            (selectedLocation === 'All' || item.location === selectedLocation)
        )
        .sort((a, b) => {
            const aValue = a[sortField as keyof typeof a];
            const bValue = b[sortField as keyof typeof b];

            if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
            if (bValue === null) return sortDirection === 'asc' ? -1 : 1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === 'asc'
                ? (aValue < bValue ? -1 : 1)
                : (bValue < aValue ? -1 : 1);
        });


    return (
        <div className='container mx-auto px-4 py-6 fade-in' >
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                        <Search className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-transparent border-none outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-right text-gray-500">
                        {filteredInventory.length} items found
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Item Name
                                        {sortField === 'name' && (
                                            <ArrowUpDown className="h-4 w-4 ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className="flex items-center">
                                        Category
                                        {sortField === 'category' && (
                                            <ArrowUpDown className="h-4 w-4 ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('quantity')}
                                >
                                    <div className="flex items-center">
                                        Quantity
                                        {sortField === 'quantity' && (
                                            <ArrowUpDown className="h-4 w-4 ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('location')}
                                >
                                    <div className="flex items-center">
                                        Location
                                        {sortField === 'location' && (
                                            <ArrowUpDown className="h-4 w-4 ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('expiry')}
                                >
                                    <div className="flex items-center">
                                        Expiry Date
                                        {sortField === 'expiry' && (
                                            <ArrowUpDown className="h-4 w-4 ml-1" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.expiry ? new Date(item.expiry).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteItem(item.id)}
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
            </div>
        </div>
    )
}

export default allProducts
