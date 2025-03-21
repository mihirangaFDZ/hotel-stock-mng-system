import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { PurchaseItem } from '../types';

interface SpendingHistoryProps {
  purchases: PurchaseItem[];
}

export const SpendingHistory: React.FC<SpendingHistoryProps> = ({ purchases }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Purchases
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Item</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Supplier</th>
              <th className="text-right py-3 px-4">Quantity</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-right py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{purchase.name}</td>
                <td className="py-3 px-4">{purchase.category}</td>
                <td className="py-3 px-4">{purchase.supplier}</td>
                <td className="py-3 px-4 text-right">{purchase.quantity}</td>
                <td className="py-3 px-4 text-right">${purchase.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  {format(new Date(purchase.date), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};