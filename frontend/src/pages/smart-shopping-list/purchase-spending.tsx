import React, { useState } from 'react';
import { FrequentItems } from './../../components/FrequentItems';
import { SpendingHistory } from './../../components/SpendingHistory';
import { BudgetAnalysis } from './../../components/BudgetAnalysis';
import { PurchasePatterns } from './../../components/PurchasePatterns';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ReportPreview } from './../../components/ReportPreview';

// Sample data - In a real application, this would come from your backend
const monthlySpendingData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 15000 },
  { month: 'Mar', amount: 13200 },
  { month: 'Apr', amount: 16800 },
  { month: 'May', amount: 14500 },
  { month: 'Jun', amount: 17000 },
];

const frequentItems = [
  {
    id: '1',
    name: 'Bath Towels',
    category: 'Linens',
    quantity: 200,
    price: 1200,
    date: '2024-03-15',
    supplier: 'Premium Linens Co.'
  },
  {
    id: '2',
    name: 'Toilet Paper',
    category: 'Supplies',
    quantity: 500,
    price: 800,
    date: '2024-03-14',
    supplier: 'Wholesale Supplies Ltd.'
  },
  {
    id: '3',
    name: 'Cleaning Solution',
    category: 'Cleaning',
    quantity: 100,
    price: 600,
    date: '2024-03-13',
    supplier: 'CleanPro Supplies'
  }
];

const recentPurchases = [
  {
    id: '4',
    name: 'Hand Soap',
    category: 'Toiletries',
    quantity: 150,
    price: 450,
    date: '2024-03-12',
    supplier: 'Hygiene Solutions Inc.'
  },
  {
    id: '5',
    name: 'Bed Sheets',
    category: 'Linens',
    quantity: 100,
    price: 2000,
    date: '2024-03-11',
    supplier: 'Premium Linens Co.'
  },
  {
    id: '6',
    name: 'Coffee Pods',
    category: 'F&B',
    quantity: 1000,
    price: 800,
    date: '2024-03-10',
    supplier: 'Beverage Supplies Ltd.'
  }
];

// Sample budget data
const budgetData = [
  { month: 'Jan', budget: 13000, actual: 12500 },
  { month: 'Feb', budget: 14000, actual: 15000 },
  { month: 'Mar', budget: 14000, actual: 13200 },
  { month: 'Apr', budget: 15000, actual: 16800 },
  { month: 'May', budget: 15000, actual: 14500 },
  { month: 'Jun', budget: 16000, actual: 17000 },
];

// Sample category trends
const categoryTrends = [
  { category: 'Linens', current: 8000, previous: 7200, change: 11 },
  { category: 'Supplies', current: 5500, previous: 6000, change: -8 },
  { category: 'F&B', current: 4200, previous: 3800, change: 11 },
  { category: 'Cleaning', current: 3800, previous: 4000, change: -5 },
  { category: 'Toiletries', current: 2800, previous: 2500, change: 12 },
];

// Sample time patterns
const timePatterns = [
  { hour: '6AM', orders: 12 },
  { hour: '8AM', orders: 28 },
  { hour: '10AM', orders: 45 },
  { hour: '12PM', orders: 32 },
  { hour: '2PM', orders: 38 },
  { hour: '4PM', orders: 25 },
  { hour: '6PM', orders: 15 },
];

// Sample report data
const reportData = {
  totalSpending: 89000,
  monthlySpending: monthlySpendingData,
  topItems: [
    { name: 'Bath Towels', quantity: 800, total: 4800 },
    { name: 'Toilet Paper', quantity: 2000, total: 3200 },
    { name: 'Bed Sheets', quantity: 400, total: 8000 },
    { name: 'Coffee Pods', quantity: 4000, total: 3200 },
    { name: 'Cleaning Solution', quantity: 400, total: 2400 }
  ],
  topSuppliers: [
    { name: 'Premium Linens Co.', total: 12800 },
    { name: 'Wholesale Supplies Ltd.', total: 8400 },
    { name: 'Beverage Supplies Ltd.', total: 6400 },
    { name: 'CleanPro Supplies', total: 4800 },
    { name: 'Hygiene Solutions Inc.', total: 3600 }
  ]
};

function pushaseSpending() {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Spending Analytics</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <TrendingUp className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Total Spending</h3>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold">LKR 89,000</p>
            <p className="text-sm text-gray-600">Last 6 months</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Most Ordered</h3>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold">Bath Towels</p>
            <p className="text-sm text-gray-600">200 units this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Top Supplier</h3>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold">Premium Linens</p>
            <p className="text-sm text-gray-600">LKR 3,200 this month</p>
          </div>
        </div>

        <div className="space-y-8">
          <BudgetAnalysis data={budgetData} />
          <PurchasePatterns 
            categoryTrends={categoryTrends}
            timePatterns={timePatterns}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <FrequentItems items={frequentItems} />
          <div className="space-y-8">
            <SpendingHistory purchases={recentPurchases} />
          </div>
        </div>

        {showReport && (
          <ReportPreview
            data={reportData}
            onClose={() => setShowReport(false)}
          />
        )}
      </div>
    </div>
  );
}

export default pushaseSpending;