import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

interface BudgetData {
  month: string;
  budget: number;
  spent: number;
}

interface PurchasePattern {
  name: string;
  purchases: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const [department, setDepartment] = useState('all');
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [purchasePatterns, setPurchasePatterns] = useState<PurchasePattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date();

  useEffect(() => {
    fetchData();
  }, [dateRange, department]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [budgetRes, spendingRes] = await Promise.all([
        axios.get(`http://localhost:8070/api/inventory/purchase-budget?range=${dateRange}&department=${department}`),
        axios.get(`http://localhost:8070/api/inventory/purchase-spending?range=${dateRange}&department=${department}`)
      ]);

      setBudgetData(budgetRes.data);
      setPurchasePatterns(spendingRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch budget and spending data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
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
    await fetchData();
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
                innerRadius={20}
                outerRadius={70}
                fill="#8884d8"
                dataKey="purchases"
                label
              >
                {purchasePatterns.map((_entry, index) => (
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
                  LKR {budgetData.reduce((sum, item) => sum + item.budget, 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+5.3% from last period</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  LKR {budgetData.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}
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

export default Reports;