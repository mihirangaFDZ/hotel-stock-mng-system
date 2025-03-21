import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

// Initial mock data
const initialBudgetData = [
  { month: 'Jan', budget: 50000, spent: 45000 },
  { month: 'Feb', budget: 50000, spent: 48000 },
  { month: 'Mar', budget: 50000, spent: 52000 },
  { month: 'Apr', budget: 55000, spent: 51000 },
  { month: 'May', budget: 55000, spent: 53000 },
  { month: 'Jun', budget: 55000, spent: 54000 },
];

const initialPurchasePatterns = [
  { name: 'Vegetables', purchases: 150 },
  { name: 'Meat', purchases: 120 },
  { name: 'Dairy', purchases: 100 },
  { name: 'Cleaning Supplies', purchases: 80 },
  { name: 'Beverages', purchases: 90 },
];

// Department-specific mock data
const departmentData = {
  kitchen: {
    budgetData: [
      { month: 'Jan', budget: 30000, spent: 28000 },
      { month: 'Feb', budget: 30000, spent: 29000 },
      { month: 'Mar', budget: 30000, spent: 31000 },
      { month: 'Apr', budget: 32000, spent: 30000 },
      { month: 'May', budget: 32000, spent: 31000 },
      { month: 'Jun', budget: 32000, spent: 32000 },
    ],
    purchasePatterns: [
      { name: 'Vegetables', purchases: 100 },
      { name: 'Meat', purchases: 90 },
      { name: 'Dairy', purchases: 80 },
      { name: 'Spices', purchases: 40 },
      { name: 'Grains', purchases: 60 },
    ],
  },
  housekeeping: {
    budgetData: [
      { month: 'Jan', budget: 15000, spent: 12000 },
      { month: 'Feb', budget: 15000, spent: 14000 },
      { month: 'Mar', budget: 15000, spent: 16000 },
      { month: 'Apr', budget: 17000, spent: 15000 },
      { month: 'May', budget: 17000, spent: 16000 },
      { month: 'Jun', budget: 17000, spent: 16500 },
    ],
    purchasePatterns: [
      { name: 'Cleaning Supplies', purchases: 70 },
      { name: 'Linens', purchases: 50 },
      { name: 'Toiletries', purchases: 60 },
      { name: 'Room Amenities', purchases: 40 },
      { name: 'Equipment', purchases: 20 },
    ],
  },
  maintenance: {
    budgetData: [
      { month: 'Jan', budget: 10000, spent: 8000 },
      { month: 'Feb', budget: 10000, spent: 9000 },
      { month: 'Mar', budget: 10000, spent: 11000 },
      { month: 'Apr', budget: 12000, spent: 11000 },
      { month: 'May', budget: 12000, spent: 11500 },
      { month: 'Jun', budget: 12000, spent: 11800 },
    ],
    purchasePatterns: [
      { name: 'Tools', purchases: 30 },
      { name: 'Spare Parts', purchases: 40 },
      { name: 'Paint', purchases: 20 },
      { name: 'Equipment', purchases: 15 },
      { name: 'Safety Gear', purchases: 25 },
    ],
  },
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function reports() {
  const [dateRange, setDateRange] = useState('month');
  const [department, setDepartment] = useState('all');
  const [budgetData, setBudgetData] = useState(initialBudgetData);
  const [purchasePatterns, setPurchasePatterns] = useState(initialPurchasePatterns);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();

  // Function to filter data based on date range
  const filterDataByDateRange = (range: string) => {
    let filteredBudgetData = [...initialBudgetData];
    switch (range) {
      case 'week':
        filteredBudgetData = filteredBudgetData.slice(-1);
        break;
      case 'month':
        filteredBudgetData = filteredBudgetData.slice(-3);
        break;
      case 'quarter':
        filteredBudgetData = filteredBudgetData.slice(-4);
        break;
      case 'year':
        // Use all data
        break;
      default:
        break;
    }
    return filteredBudgetData;
  };

  // Update data when filters change
  useEffect(() => {
    if (department === 'all') {
      setBudgetData(filterDataByDateRange(dateRange));
      setPurchasePatterns(initialPurchasePatterns);
    } else {
      setBudgetData(filterDataByDateRange(dateRange).map(item => ({
        ...item,
        budget: item.budget * 0.6,
        spent: item.spent * 0.6,
      })));
      setPurchasePatterns(departmentData[department].purchasePatterns);
    }
  }, [dateRange, department]);

  const handleExport = () => {
    // Create CSV data
    const budgetCsv = [
      'Month,Budget,Spent',
      ...budgetData.map(item => `${item.month},${item.budget},${item.spent}`),
    ].join('\n');

    const purchaseCsv = [
      'Item,Purchases',
      ...purchasePatterns.map(item => `${item.name},${item.purchases}`),
    ].join('\n');

    // Create and download budget report
    const budgetBlob = new Blob([budgetCsv], { type: 'text/csv' });
    const budgetUrl = window.URL.createObjectURL(budgetBlob);
    const budgetLink = document.createElement('a');
    budgetLink.href = budgetUrl;
    budgetLink.setAttribute('download', `budget_report_${format(currentDate, 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(budgetLink);
    budgetLink.click();
    document.body.removeChild(budgetLink);

    // Create and download purchase report
    const purchaseBlob = new Blob([purchaseCsv], { type: 'text/csv' });
    const purchaseUrl = window.URL.createObjectURL(purchaseBlob);
    const purchaseLink = document.createElement('a');
    purchaseLink.href = purchaseUrl;
    purchaseLink.setAttribute('download', `purchase_report_${format(currentDate, 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(purchaseLink);
    purchaseLink.click();
    document.body.removeChild(purchaseLink);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call with setTimeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly adjust the data to simulate refresh
    const updatedBudgetData = budgetData.map(item => ({
      ...item,
      spent: item.spent * (0.95 + Math.random() * 0.1),
    }));
    
    const updatedPurchasePatterns = purchasePatterns.map(item => ({
      ...item,
      purchases: Math.round(item.purchases * (0.95 + Math.random() * 0.1)),
    }));

    setBudgetData(updatedBudgetData);
    setPurchasePatterns(updatedPurchasePatterns);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Last updated: {format(currentDate, 'PPP')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="kitchen">Kitchen</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                isLoading ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Tracking */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Budget vs. Actual Spending</h2>
            <LineChart width={500} height={300} data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget" />
              <Line type="monotone" dataKey="spent" stroke="#82ca9d" name="Actual Spent" />
            </LineChart>
          </div>

          {/* Purchase Patterns */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Most Frequently Purchased Items</h2>
            <BarChart width={500} height={300} data={purchasePatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="purchases" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Purchase Category Distribution</h2>
            <PieChart width={500} height={300}>
              <Pie
                data={purchasePatterns}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                dataKey="purchases"
                label
              >
                {purchasePatterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Summary Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold">
                  ${budgetData.reduce((sum, item) => sum + item.budget, 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+5.3% from last period</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${budgetData.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}
                </p>
                <p className="text-sm text-red-600">+8.1% from last period</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Most Ordered Item</p>
                <p className="text-2xl font-bold">
                  {purchasePatterns.reduce((max, item) => 
                    item.purchases > max.purchases ? item : max
                  ).name}
                </p>
                <p className="text-sm text-gray-500">
                  {purchasePatterns.reduce((max, item) => 
                    item.purchases > max.purchases ? item : max
                  ).purchases} orders
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Budget Utilization</p>
                <p className="text-2xl font-bold">
                  {Math.round((budgetData.reduce((sum, item) => sum + item.spent, 0) / 
                    budgetData.reduce((sum, item) => sum + item.budget, 0)) * 100)}%
                </p>
                <p className="text-sm text-green-600">On track</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default reports;