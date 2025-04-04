import "./../../css/inventory.css"; // Verify if this CSS file is actually needed
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
import { Plus, DollarSign, ShoppingCart, Tag, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

//#region Constants and Configuration
const API_URL = "http://localhost:8070/api/inventory/";
const ACTIVITY_API_URL = "http://localhost:8070/api/inventory/activities";
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];
//#endregion

//#region Types
interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitType: string;
  department: string;
  expiryDate?: string;
  updatedAt?: string;
  price?: number;
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
}

interface StockTrendData {
  date: string;
  value: number;
}

interface RecentActivity {
  type: "added" | "updated" | "removed";
  message: string;
  details: string;
  timestamp: string; // ISO timestamp (e.g., "2025-04-04T12:34:56Z")
  displayTimestamp: string; // Formatted for display (e.g., "2 hours ago")
}
//#endregion

const InventoryDash: React.FC = () => {
  const navigate = useNavigate();

  //#region State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageData[]>([]);
  const [stockTrends, setStockTrends] = useState<StockTrendData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  //#endregion

  //#region Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory
        const inventoryResponse = await axios.get<InventoryItem[]>(API_URL);
        const inventoryData = inventoryResponse.data;
        setInventory(inventoryData);

        // Process data for charts and cards
        processCategoryData(inventoryData);
        processMonthlyUsage(inventoryData);
        processStockTrends(inventoryData);

        // Derive values for dashboard cards
        setTotalProducts(inventoryData.length);

        const uniqueCategories = new Set(
          inventoryData.map((item: InventoryItem) => item.category)
        );
        setTotalCategories(uniqueCategories.size);

        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const monthlyItems = inventoryData.filter((item: InventoryItem) => {
          if (!item.updatedAt) return false;
          const itemDate = new Date(item.updatedAt);
          return (
            itemDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            }) === currentMonth
          );
        });
        const spending = monthlyItems.reduce(
          (total: number, item: InventoryItem) =>
            total + item.quantity * (item.price || 100),
          0
        );
        setMonthlySpending(spending);

        const lowStockCount = inventoryData.filter(
          (item: InventoryItem) => item.quantity < 5
        ).length;
        setLowStockItems(lowStockCount);

        await fetchRecentActivity();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch inventory data");
      }
    };

    fetchData();

    // Poll for new activities every 30 seconds
    const interval = setInterval(fetchRecentActivity, 30000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  //#endregion

  //#region API Calls
  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get<RecentActivity[]>(ACTIVITY_API_URL);
      const activities = response.data.map((activity) => {
        const date = new Date(activity.timestamp);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const displayTimestamp =
          diffInHours < 24
            ? `${diffInHours} hours ago`
            : `${Math.floor(diffInHours / 24)} days ago`;

        return {
          ...activity,
          displayTimestamp,
        };
      });

      // Sort by timestamp (most recent first) and take the top 3
      const sortedActivities = activities
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 3);

      setRecentActivity(sortedActivities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      toast.error("Failed to fetch recent activities");
    }
  };
  //#endregion

  //#region Data Processing Functions
  const processCategoryData = (data: InventoryItem[]) => {
    const categoryMap: { [key: string]: number } = {};

    data.forEach((item) => {
      const category = item.category || "Unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const transformedCategoryData = Object.keys(categoryMap).map(
      (category) => ({
        name: category,
        value: categoryMap[category],
      })
    );

    setCategoryData(transformedCategoryData);
  };

  const processMonthlyUsage = (data: InventoryItem[]) => {
    const monthlyMap: { [key: string]: { [key: string]: number } } = {};

    data.forEach((item) => {
      if (!item.updatedAt) return;

      const date = new Date(item.updatedAt);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
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

      if (category === "groceries") monthlyMap[month].groceries += item.quantity;
      if (category === "electronics")
        monthlyMap[month].electronics += item.quantity;
      if (category === "cleaning") monthlyMap[month].cleaning += item.quantity;
      if (category === "household") monthlyMap[month].household += item.quantity;
      if (category === "personal care")
        monthlyMap[month].personalCare += item.quantity;
      if (category === "food") monthlyMap[month].food += item.quantity;
      if (category === "vegetables")
        monthlyMap[month].vegetables += item.quantity;
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

  const processStockTrends = (data: InventoryItem[]) => {
    const dailyMap: { [key: string]: number } = {};

    data.forEach((item) => {
      if (!item.updatedAt) return;

      const date = new Date(item.updatedAt);
      const day = date.toISOString().split("T")[0];

      dailyMap[day] = (dailyMap[day] || 0) + item.quantity;
    });

    const transformedStockTrends = Object.keys(dailyMap)
      .sort()
      .map((date) => ({
        date,
        value: dailyMap[date],
      }));

    setStockTrends(transformedStockTrends);
  };
  //#endregion

  //#region Render
  return (
    <div className="container mx-auto px-4 py-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Inventory Management
        </h1>
        <button
          onClick={() => navigate("/add-item")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <a
          href="/all-products"
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
        >
          <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-gray-600">{totalProducts} items</p>
        </a>
        <a
          href="#"
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
        >
          <DollarSign className="h-8 w-8 text-green-600 mb-2" />
          <h2 className="text-xl font-semibold">Monthly Spending</h2>
          <p className="text-gray-600">{monthlySpending} LKR</p>
        </a>
        <a
          href="#"
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
        >
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
          <h2 className="text-xl font-semibold">Low Stock Items</h2>
          <p className="text-gray-600">{lowStockItems} items</p>
        </a>
        <a
          href="#"
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
        >
          <Tag className="h-8 w-8 text-yellow-600 mb-2" />
          <h2 className="text-xl font-semibold">All Categories</h2>
          <p className="text-gray-600">{totalCategories} categories</p>
        </a>
      </div>

      {/* Charts */}
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
                    label={(entry: { name: string; percent: number }) =>
                      `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No category data available.
              </p>
            )}
          </div>
        </div>

        {/* Monthly Usage Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Usage by Category
          </h2>
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
                    .filter((key) => key !== "month")
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
              <p className="text-center text-gray-500">
                No monthly usage data available.
              </p>
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
              <p className="text-center text-gray-500">
                No stock trends data available.
              </p>
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
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {activity.displayTimestamp}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No recent activity available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
  //#endregion
};

export default InventoryDash;