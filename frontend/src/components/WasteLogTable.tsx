import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

const WasteLogTable: React.FC = () => {
  // Embedded mock data with real-life parameters
  const wasteItems = [
    {
      id: '1',
      itemName: 'Bread',
      category: 'food',
      quantityDiscarded: 2.5,
      unit: 'kg',
      reason: 'Expired',
      dateLogged: '2025-03-20T10:00:00Z',
    },
    {
      id: '2',
      itemName: 'Milk',
      category: 'beverages',
      quantityDiscarded: 5.0,
      unit: 'liters',
      reason: 'Spoiled',
      dateLogged: '2025-03-21T14:30:00Z',
    },
    {
      id: '3',
      itemName: 'Vegetables',
      category: 'food',
      quantityDiscarded: 10.0,
      unit: 'kg',
      reason: 'Spoiled',
      dateLogged: '2025-03-22T09:15:00Z',
    },
    {
      id: '4',
      itemName: 'Napkins',
      category: 'supplies',
      quantityDiscarded: 50,
      unit: 'count',
      reason: 'Damaged',
      dateLogged: '2025-03-23T16:45:00Z',
    },
    {
      id: '5',
      itemName: 'Orange Juice',
      category: 'beverages',
      quantityDiscarded: 3.0,
      unit: 'liters',
      reason: 'Overstock',
      dateLogged: '2025-03-24T11:20:00Z',
    },
  ];

  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof wasteItems)[0] | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  // Sorting function
  const sortedItems = [...wasteItems].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const key = sortConfig.key;
    if (key === 'dateLogged') {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (key === 'quantityDiscarded') {
      return sortConfig.direction === 'asc'
        ? a[key] - b[key]
        : b[key] - a[key];
    }
    return sortConfig.direction === 'asc'
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });

  const handleSort = (key: keyof (typeof wasteItems)[0]) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('itemName')}
              >
                <div className="flex items-center gap-1">
                  Item Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('quantityDiscarded')}
              >
                <div className="flex items-center gap-1">
                  Quantity
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('reason')}
              >
                <div className="flex items-center gap-1">
                  Reason
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('dateLogged')}
              >
                <div className="flex items-center gap-1">
                  Date Logged
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.itemName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 capitalize">
                    {item.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.quantityDiscarded} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.reason === 'Expired'
                        ? 'bg-red-100 text-red-800'
                        : item.reason === 'Spoiled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.reason === 'Damaged'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.reason}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(item.dateLogged).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {wasteItems.length === 0 && (
        <p className="text-center text-gray-500 py-6">No waste items logged yet.</p>
      )}
    </div>
  );
};

export default WasteLogTable;