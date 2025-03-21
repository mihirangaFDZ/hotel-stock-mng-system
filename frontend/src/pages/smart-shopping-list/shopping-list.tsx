import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Package2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  currentStock: number;
}


function shoppingList() {
    const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      name: 'Bath Towels',
      quantity: 20,
      threshold: 50,
      currentStock: 30
    },
    {
      id: '2',
      name: 'Bed Sheets',
      quantity: 15,
      threshold: 40,
      currentStock: 25
    },
    {
      id: '3',
      name: 'Toiletries Set',
      quantity: 50,
      threshold: 100,
      currentStock: 45
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    threshold: '',
    currentStock: ''
  });

  const adjustQuantity = (id: string, increment: boolean) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(0, item.quantity - 1) }
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const threshold = parseInt(newItem.threshold);
    const currentStock = parseInt(newItem.currentStock);
    
    if (newItem.name && !isNaN(threshold) && !isNaN(currentStock)) {
      const newItemEntry: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: Math.max(0, threshold - currentStock),
        threshold: threshold,
        currentStock: currentStock
      };
      
      setItems([...items, newItemEntry]);
      setNewItem({ name: '', threshold: '', currentStock: '' });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ 
      backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.5)), url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80')`
    }}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hotel Stock Manager
          </h1>
          <p className="text-gray-600 text-sm mt-1">Inventory Management System</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => navigate('/pushase-spending')}>
          History
        </button>
        <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700" onClick={() => navigate('/reports')}>
          Reports
        </button>
      </div>
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add New Item Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover-scale transition-all duration-300">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-3 mb-6">
              <Package2 className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Add New Item</h3>
            </div>
            <form onSubmit={handleAddItem} className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                  Threshold
                </label>
                <input
                  type="number"
                  id="threshold"
                  value={newItem.threshold}
                  onChange={(e) => setNewItem({ ...newItem, threshold: e.target.value })}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Minimum stock level"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
                  Current Stock
                </label>
                <input
                  type="number"
                  id="currentStock"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                  className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Current stock level"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover-scale transition-all duration-300">
          <div className="px-6 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Auto-generated Shopping List</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Items that need to be restocked based on current inventory levels and thresholds.
                </p>
              </div>
            </div>

            {/* Shopping List */}
            <div className="mt-8 flow-root">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50/80">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Quantity</th>
                      <th className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`${item.currentStock < item.threshold ? 'bg-red-50/80' : ''} animate-fade-in hover:bg-gray-50/80 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => adjustQuantity(item.id, false)}
                              className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => adjustQuantity(item.id, true)}
                              className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary</h3>
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-6 py-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <dt className="text-sm font-medium text-blue-100">Total Items</dt>
                  <dd className="mt-2 text-4xl font-semibold text-white">{items.length}</dd>
                </div>
                <div className="px-6 py-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <dt className="text-sm font-medium text-purple-100">Items Below Threshold</dt>
                  <dd className="mt-2 text-4xl font-semibold text-white">
                    {items.filter(item => item.currentStock < item.threshold).length}
                  </dd>
                </div>
                <div className="px-6 py-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                  <dt className="text-sm font-medium text-indigo-100">Total Order Quantity</dt>
                  <dd className="mt-2 text-4xl font-semibold text-white">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default shoppingList;