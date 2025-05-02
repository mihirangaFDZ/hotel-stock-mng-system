import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Package2, PencilIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import sweetalert2

// Define the Item interface for TypeScript
interface Item {
  _id: string;
  name: string;
  quantity: number;
  threshold: number;
  currentStock: number;
}

// Define the shape of newItem state
interface NewItem {
  name: string;
  threshold: string;
  currentStock: string;
}

// Define the InventoryItem interface for TypeScript
interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitType: string;
  department: string;
  expiryDate?: string;
}

function ShoppingList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    threshold: '',
    currentStock: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ quantity: string; threshold: string; currentStock: string }>({
    quantity: '',
    threshold: '',
    currentStock: '',
  });
  const [nameError, setNameError] = useState<string>(''); // State for name validation error

  // Fetch both shopping list and inventory items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shoppingListRes, inventoryRes] = await Promise.all([
          axios.get<Item[]>('http://localhost:8070/api/shopping-list'),
          axios.get<InventoryItem[]>('http://localhost:8070/api/inventory')
        ]);
        
        setItems(shoppingListRes.data);
        setInventoryItems(inventoryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch data. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb',
        });
      }
    };

    fetchData();
  }, []);

  const adjustQuantity = (id: string, increment: boolean) => {
    axios.put<Item>(`http://localhost:8070/api/shopping-list/${id}`, { increment })
      .then(response => {
        setItems(items.map(item =>
          item._id === id ? response.data : item
        ));
      })
      .catch(error => console.error('Error adjusting quantity:', error));
  };

  const removeItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      axios.delete(`http://localhost:8070/api/shopping-list/${id}`)
        .then(() => {
          setItems(items.filter(item => item._id !== id));
        })
        .catch(error => console.error('Error removing item:', error));
    }
  };

  // Validate item name (only letters, spaces, and hyphens allowed)
  const validateItemName = (name: string): boolean => {
    const regex = /^[A-Za-z\s-]+$/; // Allows letters, spaces, and hyphens
    return regex.test(name);
  };

  // Handle change for item name with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem({ ...newItem, name: value });

    if (value === '') {
      setNameError('Item name is required');
    } else if (!validateItemName(value)) {
      setNameError('Item name can only contain letters, spaces, and hyphens (no numbers)');
    } else {
      setNameError('');
    }
  };

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const threshold = parseInt(newItem.threshold);
    const currentStock = parseInt(newItem.currentStock);

    // Validate item name before proceeding
    if (!newItem.name) {
      setNameError('Item name is required');
      return;
    }
    if (!validateItemName(newItem.name)) {
      setNameError('Item name can only contain letters, spaces, and hyphens (no numbers)');
      return;
    }
    if (isNaN(threshold) || threshold < 0) {
      alert('Please enter a valid threshold (a non-negative number).');
      return;
    }
    if (isNaN(currentStock) || currentStock < 0) {
      alert('Please enter a valid current stock (a non-negative number).');
      return;
    }

    // Check if item exists in inventory
    const inventoryItem = inventoryItems.find(item => item.itemName.toLowerCase() === newItem.name.toLowerCase());
    
    if (!inventoryItem) {
      Swal.fire({
        title: 'Warning!',
        text: 'This item does not exist in the inventory. Please add it to inventory first.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    // Show sweetalert2 confirmation popup
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to add the item "${newItem.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#2563eb', // Blue color for the "Yes" button
      cancelButtonColor: '#6b7280',  // Gray color for the "No" button
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with adding the item if user confirms
        axios.post<Item>('http://localhost:8070/api/shopping-list', {
          name: newItem.name,
          threshold,
          currentStock: inventoryItem.quantity, // Use inventory quantity as current stock
        })
          .then(response => {
            setItems([...items, response.data]);
            setNewItem({ name: '', threshold: '', currentStock: '' });
            setNameError(''); // Clear error after successful submission
            // Optional: Show success message
            Swal.fire({
              title: 'Success!',
              text: `Item "${newItem.name}" has been added.`,
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb',
            });
          })
          .catch(error => {
            console.error('Error adding item:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add item. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#2563eb',
            });
          });
      }
    });
  };

  const startEditing = (item: Item) => {
    setEditingId(item._id);
    setEditForm({
      quantity: item.quantity.toString(),
      threshold: item.threshold.toString(),
      currentStock: item.currentStock.toString(),
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = (id: string) => {
    const quantity = parseInt(editForm.quantity);
    const threshold = parseInt(editForm.threshold);
    const currentStock = parseInt(editForm.currentStock);

    if (!isNaN(quantity) && !isNaN(threshold) && !isNaN(currentStock)) {
      if (window.confirm('Are you sure you want to save these changes?')) {
        axios.put<Item>(`http://localhost:8070/api/shopping-list/${id}`, {
          quantity,
          threshold,
          currentStock,
        })
          .then(response => {
            setItems(items.map(item =>
              item._id === id ? response.data : item
            ));
            setEditingId(null);
          })
          .catch(error => console.error('Error updating item:', error));
      }
    } else {
      alert('Please enter valid numbers for quantity, threshold, and current stock.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.5)), url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80')`,
      }}
    >
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
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => navigate('/purchase-spending')}
              >
                History
              </button>
              
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add Inventory Items Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover-scale transition-all duration-300">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-3 mb-6">
              <Package2 className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Available Inventory Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white/80 divide-y divide-gray-200">
                  {inventoryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity} {item.unitType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setNewItem({
                              name: item.itemName,
                              threshold: '5', // Default threshold
                              currentStock: item.quantity.toString()
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Add to Shopping List
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
                  onChange={handleNameChange}
                  className={`block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200 ${
                    nameError ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter item name"
                  required
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
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
                  disabled={!!nameError} // Disable button if there's a name error
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
                <h2 className="text-2xl font-bold text-gray-900">Shopping List</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Items that need to be restocked based on current inventory levels and thresholds.
                </p>
              </div>
            </div>

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
                        key={item._id}
                        className={`${item.currentStock < item.threshold ? 'bg-red-50/80' : ''} animate-fade-in hover:bg-gray-50/80 transition-colors duration-150`}
                      >
                        {editingId === item._id ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="number"
                                name="currentStock"
                                value={editForm.currentStock}
                                onChange={handleEditChange}
                                className="w-20 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                min="0"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="number"
                                name="threshold"
                                value={editForm.threshold}
                                onChange={handleEditChange}
                                className="w-20 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                min="0"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                type="number"
                                name="quantity"
                                value={editForm.quantity}
                                onChange={handleEditChange}
                                className="w-20 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                min="0"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => saveEdit(item._id)}
                                className="text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full p-1.5 transition-colors duration-200 mr-2"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full p-1.5 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => adjustQuantity(item._id, false)}
                                  className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => adjustQuantity(item._id, true)}
                                  className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => startEditing(item)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full p-1.5 transition-colors duration-200 mr-2"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </>
                        )}
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

export default ShoppingList;