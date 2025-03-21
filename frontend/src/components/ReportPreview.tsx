import React from 'react';
import { format } from 'date-fns';

interface ReportPreviewProps {
  onClose: () => void;
  data: {
    totalSpending: number;
    monthlySpending: Array<{ month: string; amount: number }>;
    topItems: Array<{ name: string; quantity: number; total: number }>;
    topSuppliers: Array<{ name: string; total: number }>;
  };
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ onClose, data }) => {
  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Report Header */}
          <div className="text-center border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900">Spending Report</h2>
            <p className="text-gray-600">Generated on {currentDate}</p>
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p className="text-lg">Total Spending: ${data.totalSpending.toLocaleString()}</p>
            <p className="text-gray-600">Period: Last 6 months</p>
          </div>

          {/* Monthly Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Monthly Breakdown</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlySpending.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.month}</td>
                    <td className="px-4 py-2 text-right">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Items */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Most Purchased Items</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.topItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Suppliers */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Top Suppliers</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Supplier</th>
                  <th className="px-4 py-2 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.topSuppliers.map((supplier, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{supplier.name}</td>
                    <td className="px-4 py-2 text-right">${supplier.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close Preview
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};