import "./../../css/inventory.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Legend,
  Line,
} from "recharts";
import {
  Plus,
  DollarSign,
  ShoppingCart,
  Tag,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8070/api/inventory/';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitType: string;
  department: string;
  expiryDate?: string;
  updatedAt?: string;
  actionHistory?: { actionType: string; timestamp: string }[];
}

interface CategoryData {
  name: string;
  value: number;
}

interface MonthlyUsageData {
  month: string;
  groceries: number;
  electronics: number;
  cleaning: number;
  household?: number;
  personalCare?: number;
  food?: number;
  vegetables?: number;
  updatedAt?: { $date: string };
}

interface StockTrendData {
  date: string;
  value: number;
}

interface RecentActivity {
  type: string;
  message: string;
  details: string;
  timestamp: string;
}

const InventoryDash = () => {
  const navigate = useNavigate();

  // State for inventory and chart data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageData[]>([]);
  const [stockTrends, setStockTrends] = useState<StockTrendData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Fetch inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(API_URL);
        const inventoryData = response.data;
        setInventory(inventoryData);

        // Process data for charts
        processCategoryData(inventoryData);
        processMonthlyUsage(inventoryData);
        processStockTrends(inventoryData);
        processRecentActivity(inventoryData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventory();
  }, []);

  // Process data for Category Distribution (Pie Chart)
  const processCategoryData = (data: InventoryItem[]) => {
    const categoryMap: { [key: string]: number } = {};

    data.forEach((item) => {
      const category = item.category || 'Unknown';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const transformedCategoryData = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));

    setCategoryData(transformedCategoryData);
  };

  // Process data for Monthly Usage (Bar Chart)
  const processMonthlyUsage = (data: InventoryItem[]) => {
    const monthlyMap: { [key: string]: { [key: string]: number } } = {};

    data.forEach((item) => {
      if (!item.updatedAt) return; // Skip items without updatedAt

      const date = new Date(item.updatedAt);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., "January 2024"
      const category = item.category.toLowerCase();

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          groceries: 0,
          electronics: 0,
          cleaning: 0,
          household: 0,
          personalCare: 0,
          food: 0,
          vegetables: 0,
        };
      }

      // Map categories to the chart data (adjust based on your actual categories)
      if (category === 'groceries') monthlyMap[month].groceries += item.quantity;
      if (category === 'electronics') monthlyMap[month].electronics += item.quantity;
      if (category === 'cleaning') monthlyMap[month].cleaning += item.quantity;
      if (category === 'household') monthlyMap[month].household += item.quantity;
      if (category === 'personal care') monthlyMap[month].personalCare += item.quantity;
      if (category === 'food') monthlyMap[month].food += item.quantity;
      if (category === 'vegetables') monthlyMap[month].vegetables += item.quantity;
    });

    const transformedMonthlyUsage = Object.keys(monthlyMap).map((month) => ({
      month,
      groceries: monthlyMap[month].groceries || 0,
      electronics: monthlyMap[month].electronics || 0,
      cleaning: monthlyMap[month].cleaning || 0,
      household: monthlyMap[month].household || 0,
      personalCare: monthlyMap[month].personalCare || 0,
      food: monthlyMap[month].food || 0,
      vegetables: monthlyMap[month].vegetables || 0,
    }));

    setMonthlyUsage(transformedMonthlyUsage);
  };

  // Process data for Stock Trends (Line Chart)
  const processStockTrends = (data: InventoryItem[]) => {
    const dailyMap: { [key: string]: number } = {};

    data.forEach((item) => {
      if (!item.updatedAt) return; // Skip items without updatedAt

      const date = new Date(item.updatedAt);
      const day = date.toISOString().split('T')[0]; // e.g., "2024-03-01"

      dailyMap[day] = (dailyMap[day] || 0) + item.quantity;
    });

    const transformedStockTrends = Object.keys(dailyMap)
      .sort() // Sort by date
      .map((date) => ({
        date,
        value: dailyMap[date],
      }));

    setStockTrends(transformedStockTrends);
  };

  // Process data for Recent Activity
  const processRecentActivity = (data: InventoryItem[]) => {
    const activities: RecentActivity[] = [];
  
    data.forEach((item) => {
      if (item.updatedAt) {
        const date = new Date(item.updatedAt);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const timestamp =
          diffInHours < 24
            ? `${diffInHours} hours ago`
            : `${Math.floor(diffInHours / 24)} days ago`;
  
        activities.push({
          type: 'update',
          message: 'Item Updated',
          details: `${item.itemName} (${item.quantity} ${item.unitType}) updated in ${item.category}`,
          timestamp,
        });
      }
    });
  
    // Sort by timestamp (most recent first) and limit to 3
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);
  
    setRecentActivity(sortedActivities);
  };  

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {/* Card 1 */}
            <a href="/all-products">
              <div className="bg-white shadow-lg rounded-lg p-6" id="card">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">Total Products</h2>
                <p className="text-gray-600">Details about products</p>
              </div>
            </a>

            {/* Card 2 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id="card">
                <DollarSign className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-semibold">Monthly Spending</h2>
                <p className="text-gray-600">Details about spending.</p>
              </div>
            </a>

            {/* Card 3 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id="card">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-semibold">Low Stock Items</h2>
                <p className="text-gray-600">Details about low stock items</p>
              </div>
            </a>

            {/* Card 4 */}
            <a href="">
              <div className="bg-white shadow-lg rounded-lg p-6" id="card">
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
              {categoryData.length > 0 ? (
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
              ) : (
                <p className="text-center text-gray-500">No category data available.</p>
              )}
            </div>
          </div>

          {/* Monthly Usage Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Usage by Category</h2>
            <div className="h-80">
              {monthlyUsage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(monthlyUsage[0] || {})
                      .filter((key) => key !== 'month')
                      .map((category, index) => (
                        <Bar
                          key={category}
                          dataKey={category}
                          fill={COLORS[index % COLORS.length]}
                          name={category.charAt(0).toUpperCase() + category.slice(1)}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No monthly usage data available.</p>
              )}
            </div>
          </div>

          {/* Stock Value Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Stock Value Trends</h2>
            <div className="h-80">
              {stockTrends.length > 0 ? (
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
              ) : (
                <p className="text-center text-gray-500">No stock trends data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No recent activity available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDash;