import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const WasteAnalytics: React.FC = () => {
  // Embedded mock data with additional category breakdown
  const wasteStats = {
    totalWaste: 245.5, // Total waste in kg (solids equivalent)
    mostDiscardedItems: [
      { item: 'Bread', quantity: 12.5, unit: 'kg', category: 'food' },
      { item: 'Milk', quantity: 18.0, unit: 'liters', category: 'beverages' },
      { item: 'Vegetables', quantity: 25.0, unit: 'kg', category: 'food' },
      { item: 'Napkins', quantity: 150, unit: 'count', category: 'supplies' },
      { item: 'Orange Juice', quantity: 10.0, unit: 'liters', category: 'beverages' },
    ],
    wasteByReason: [
      { reason: 'Expired', percentage: 45 },
      { reason: 'Spoiled', percentage: 30 },
      { reason: 'Damaged', percentage: 15 },
      { reason: 'Overstock', percentage: 10 },
    ],
    wasteByCategory: [
      { category: 'Food', total: 37.5, unit: 'kg' }, // Bread + Vegetables
      { category: 'Beverages', total: 28.0, unit: 'liters' }, // Milk + Orange Juice
      { category: 'Supplies', total: 150, unit: 'count' }, // Napkins
    ],
  };

  const [showAllItems, setShowAllItems] = useState(false);
  const visibleItems = showAllItems
    ? wasteStats.mostDiscardedItems
    : wasteStats.mostDiscardedItems.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Waste Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Waste Statistics (Last 30 Days)
          </h3>
          <span
            title="Data based on last 30 days of recorded waste"
            className="cursor-help"
          >
            <Info className="h-5 w-5 text-gray-400" />
          </span>
        </div>
        <div className="text-3xl font-bold text-teal-600 mb-2">
          {wasteStats.totalWaste} kg
        </div>
        <p className="text-sm text-gray-600">Total waste recorded (solids equivalent)</p>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Most Discarded Items</h4>
          <ul className="space-y-3">
            {visibleItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm text-gray-700"
              >
                <span>{item.item} ({item.category})</span>
                <span className="font-medium text-teal-600">
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
          {wasteStats.mostDiscardedItems.length > 3 && (
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="mt-3 flex items-center text-teal-600 hover:text-teal-800 transition-colors text-sm"
            >
              {showAllItems ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show More
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Waste by Reason and Category Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Waste Breakdown</h3>
          <span
            title="Breakdown of waste by reason and category"
            className="cursor-help"
          >
            <Info className="h-5 w-5 text-gray-400" />
          </span>
        </div>
        
        {/* Waste by Reason */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">By Reason</h4>
          <div className="space-y-4">
            {wasteStats.wasteByReason.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{stat.reason}</span>
                  <span className="font-medium">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste by Category */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">By Category</h4>
          <ul className="space-y-3">
            {wasteStats.wasteByCategory.map((cat, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm text-gray-700"
              >
                <span>{cat.category}</span>
                <span className="font-medium text-teal-600">
                  {cat.total} {cat.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="col-span-1 lg:col-span-2 text-center text-xs text-gray-500 mt-4">
        Data sourced from mock hotel records | Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default WasteAnalytics;