import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSort, FaSearch } from 'react-icons/fa';
import { stockData, StockItem } from '../data/dummyData';

const StockDashboard: React.FC<{ onRestock: (item: StockItem) => void }> = ({ onRestock }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof StockItem>('item');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stock, setStock] = useState(stockData);

  useEffect(() => {
    const interval = setInterval(() => {
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          quantity: Math.max(0, item.quantity - Math.floor(Math.random() * item.usageRate * 0.5)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = stock
    .filter((item) => item.item.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (categoryFilter ? item.category === categoryFilter : true))
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 glass-effect rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Stock Overview</h2>
        <div className="flex space-x-4">
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            className="p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Linens">Linens</option>
            <option value="Toiletries">Toiletries</option>
          </select>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              {['item', 'category', 'quantity', 'threshold', 'supplier', 'trend', 'predictedDepletion'].map((key) => (
                <th
                  key={key}
                  onClick={() => { setSortBy(key as keyof StockItem); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  className="p-4 text-blue-400 cursor-pointer hover:text-blue-300"
                >
                  <span className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)} <FaSort className="ml-1" />
                  </span>
                </th>
              ))}
              <th className="p-4 text-blue-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <motion.tr
                key={item.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="border-b border-gray-700"
              >
                <td className="p-4 text-white">{item.item}</td>
                <td className="p-4 text-white">{item.category}</td>
                <td className={`p-4 ${item.quantity < item.threshold ? 'text-red-400' : 'text-green-400'}`}>
                  {item.quantity}
                </td>
                <td className="p-4 text-white">{item.threshold}</td>
                <td className="p-4 text-white">{item.supplier}</td>
                <td className="p-4 text-white">{item.trend}</td>
                <td className="p-4 text-white">{item.predictedDepletion}</td>
                <td className="p-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRestock(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                  >
                    Restock
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StockDashboard;