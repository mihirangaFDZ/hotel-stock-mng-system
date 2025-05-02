import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Plus, DollarSign, ShoppingCart, Tag, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8070/api/inventory/";
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

interface InventoryItem {
  _id: string;
  itemName: string;
  category: string;
  quantity: number;
  unitType: string;
  department: string;
  expiryDate?: string;
  updatedAt?: string;
  threshold: number;
  price?: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface InventoryValue {
  month: string;
  groceries: number;
  electronics: number;
  cleaning: number;
  household?: number;
  personalCare?: number;
  food?: number;
  vegetables?: number;
}

const InventoryDash: React.FC = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<InventoryValue[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryResponse = await axios.get<InventoryItem[]>(API_URL);
        const inventoryData = inventoryResponse.data;
        setInventory(inventoryData);

        processCategoryData(inventoryData);
        processMonthlyUsage(inventoryData);

        setTotalProducts(inventoryData.length);
        const uniqueCategories = new Set(inventoryData.map((item) => item.category));
        setTotalCategories(uniqueCategories.size);

        // Calculate total inventory value from ALL items, not just current month
        const totalValue = inventoryData.reduce((total, item) => total + item.quantity * (item.price || 100), 0);
        setInventoryValue(totalValue);

        // Keep the monthly filtering for other purposes
        const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
        const monthlyItems = inventoryData.filter((item) => {
          if (!item.updatedAt) return false;
          const itemDate = new Date(item.updatedAt);
          return itemDate.toLocaleString("default", { month: "long", year: "numeric" }) === currentMonth;
        });

        const lowStockCount = inventoryData.filter((item) => item.quantity < item.threshold).length;
        setLowStockItems(lowStockCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch inventory data");
      }
    };

    fetchData();
  }, []);

  const processCategoryData = (data: InventoryItem[]) => {
    const categoryMap: { [key: string]: number } = {};
    data.forEach((item) => {
      const category = item.category || "Unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    const transformedCategoryData = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));
    setCategoryData(transformedCategoryData);
  };

  const processMonthlyUsage = (data: InventoryItem[]) => {
    const monthlyMap: { [key: string]: { [key: string]: number } } = {};
    data.forEach((item) => {
      if (!item.updatedAt) return;
      const date = new Date(item.updatedAt);
      const month = date.toLocaleString("default", { month: "long", year: "numeric" });
      const category = item.category.toLowerCase();

      if (!monthlyMap[month]) {
        monthlyMap[month] = { groceries: 0, electronics: 0, cleaning: 0, household: 0, personalCare: 0, food: 0, vegetables: 0 };
      }

      if (category === "groceries") monthlyMap[month].groceries += item.quantity;
      if (category === "electronics") monthlyMap[month].electronics += item.quantity;
      if (category === "cleaning") monthlyMap[month].cleaning += item.quantity;
      if (category === "household") monthlyMap[month].household += item.quantity;
      if (category === "personal care") monthlyMap[month].personalCare += item.quantity;
      if (category === "food") monthlyMap[month].food += item.quantity;
      if (category === "vegetables") monthlyMap[month].vegetables += item.quantity;
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

  return (
    <div className="container mx-auto px-4 py-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
        <button
          onClick={() => navigate("/add-item")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <a href="/all-products" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-gray-600">{totalProducts} items</p>
        </a>
        <a href="#" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <DollarSign className="h-8 w-8 text-green-600 mb-2" />
          <h2 className="text-xl font-semibold">Inventory Value</h2>
          <p className="text-gray-600">{inventoryValue.toLocaleString()} LKR</p>
        </a>
        <a href="/low-stock" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
          <h2 className="text-xl font-semibold">Low Stock Items</h2>
          <p className="text-gray-600">{lowStockItems} items</p>
        </a>
        <a href="/categories" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <Tag className="h-8 w-8 text-yellow-600 mb-2" />
          <h2 className="text-xl font-semibold">All Categories</h2>
          <p className="text-gray-600">{totalCategories} categories</p>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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
              <p className="text-center text-gray-500">No monthly usage data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDash;