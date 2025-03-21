import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import { BarChart as BarChartIcon, Clock } from 'lucide-react';

interface CategoryTrend {
  category: string;
  current: number;
  previous: number;
  change: number;
}

interface TimePattern {
  hour: string;
  orders: number;
}

interface PurchasePatternsProps {
  categoryTrends: CategoryTrend[];
  timePatterns: TimePattern[];
}

export const PurchasePatterns: React.FC<PurchasePatternsProps> = ({ categoryTrends, timePatterns }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <BarChartIcon className="w-6 h-6 text-indigo-600" />
        Purchase Patterns
      </h2>

      <div className="space-y-8">
        {/* Category Trends */}
        <div>
          <h3 className="text-lg font-medium mb-4">Category Trends</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Current Month</th>
                  <th className="px-4 py-2 text-right">Previous Month</th>
                  <th className="px-4 py-2 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {categoryTrends.map((trend, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{trend.category}</td>
                    <td className="px-4 py-2 text-right">${trend.current.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">${trend.previous.toLocaleString()}</td>
                    <td className={`px-4 py-2 text-right ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.change >= 0 ? '+' : ''}{trend.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Time Patterns */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Order Time Patterns
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4F46E5" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};