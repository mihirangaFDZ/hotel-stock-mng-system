import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlySpending } from '../types';

interface SpendingChartProps {
  data: MonthlySpending[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};