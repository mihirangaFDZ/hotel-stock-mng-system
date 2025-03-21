import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface BudgetData {
  month: string;
  budget: number;
  actual: number;
}

interface BudgetAnalysisProps {
  data: BudgetData[];
}

export const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ data }) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.actual, 0);
  const variance = totalSpent - totalBudget;
  const isOverBudget = variance > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-indigo-600" />
        Budget Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
        </div>
        <div className={`rounded-lg p-4 ${isOverBudget ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-sm text-gray-600">Variance</p>
          <div className="flex items-center gap-2">
            {isOverBudget ? (
              <TrendingUp className="w-5 h-5 text-red-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500" />
            )}
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(variance).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="budget" stroke="#4F46E5" name="Budget" />
            <Line type="monotone" dataKey="actual" stroke="#EF4444" name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};