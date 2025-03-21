import React from 'react';
import { Package2 } from 'lucide-react';
import { PurchaseItem } from '../types';

interface FrequentItemsProps {
  items: PurchaseItem[];
}

export const FrequentItems: React.FC<FrequentItemsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Package2 className="w-5 h-5" />
        Frequently Purchased Items
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{item.quantity} units</p>
              <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};