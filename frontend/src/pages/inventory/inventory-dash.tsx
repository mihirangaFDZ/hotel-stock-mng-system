import "./../../css/inventory.css"
import { ResponsiveContainer, PieChart, Pie, Cell,    
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart,
  Legend,  
  Line} from "recharts";

import {
  Plus,
  DollarSign,
  ShoppingCart,
  Tag,
  AlertTriangle,
  TrendingUp,
  

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const categoryData: Array<{ name: string; value: number }> = [
  { name: "Electronics", value: 30 },
  { name: "Groceries", value: 20 },
  { name: "Clothing", value: 50 },
];
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const monthlyUsage: {
  month: string;
  groceries: number;
  electronics: number;
  cleaning: number;
}[] = [
    { month: "January", groceries: 200, electronics: 150, cleaning: 100 },
    { month: "February", groceries: 180, electronics: 170, cleaning: 120 },
    { month: "March", groceries: 220, electronics: 130, cleaning: 90 },
  ];

  const stockTrends: { 
    date: string; 
    value: number; 
  }[] = [
    { date: "2024-03-01", value: 150 },
    { date: "2024-03-02", value: 200 },
    { date: "2024-03-03", value: 180 },
  ];
  

const InventoryDash = () => {



  const navigate = useNavigate();


  return (

    <div className="container mx-auto px-4 py-6 fade-in">

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
        <button
          onClick={() => navigate('/add-item')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Item</span>
        </button>
      </div>
      <div className="container mx-auto px-4 py-6 fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full" >
            {/* Card 1 */}
            <a href="/all-products">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">Total Products</h2>
                <p className="text-gray-600">Details about products</p>
              </div>
            </a>

            {/* Card 2 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <DollarSign className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-semibold">Monthly Spending</h2>
                <p className="text-gray-600">Details about spending.</p>
              </div>
            </a>

            {/* Card 3 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-semibold">Low Stock Items</h2>
                <p className="text-gray-600">Details about low stock items</p>
              </div>
            </a>


            {/* Card 4 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id='card'>
                <Tag className="h-8 w-8 text-yellow-600" />
                <h2 className="text-xl font-semibold">All Categories</h2>
                <p className="text-gray-600">Details about stock 4.</p>
              </div>
            </a>
          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Inventory by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: { name: string; percent: number }) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Usage Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Usage by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="groceries" fill="#4F46E5" />
                  <Bar dataKey="electronics" fill="#10B981" />
                  <Bar dataKey="cleaning" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>

          {/* Stock Value Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Stock Value Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New stock received</p>
                  <p className="text-sm text-gray-500">50 units of Fresh Produce added</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-orange-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                  <p className="text-sm text-gray-500">Cleaning supplies running low</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Monthly report generated</p>
                  <p className="text-sm text-gray-500">March 2024 inventory report is ready</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>





    </div>
  );
};

export default InventoryDash;