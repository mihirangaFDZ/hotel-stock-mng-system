import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';
import { Activity, AlertCircle, TrendingUp } from 'lucide-react';

interface UsageData {
  itemName: string;
  usagePercentage: number;
  quantity: number;
  threshold: number;
  department: string;
}

interface PurchaseData {
  date: string;
  quantity: number;
  totalAmount: number;
  department: string;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const PurchaseHistoryAnalysis: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedTimeframe, selectedDepartment]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usageResponse, purchaseResponse] = await Promise.all([
        axios.get(`http://localhost:8070/api/inventory?range=${selectedTimeframe}&department=${selectedDepartment}`),
        axios.get(`http://localhost:8070/api/inventory/purchase-spending?range=${selectedTimeframe}&department=${selectedDepartment}`)
      ]);

      const processedUsageData = usageResponse.data.map((item: any) => ({
        itemName: item.itemName,
        usagePercentage: Math.min(100, Math.max(1, 
          ((item.threshold * 2 - item.quantity) / (item.threshold * 2)) * 100
        )),
        quantity: item.quantity,
        threshold: item.threshold,
        department: item.department
      }));

      setUsageData(processedUsageData);
      setPurchaseData(purchaseResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const departmentUsage = usageData.reduce((acc, item) => {
    const dept = item.department;
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        averageUsage: 0,
        itemCount: 0
      };
    }
    acc[dept].averageUsage += item.usagePercentage;
    acc[dept].itemCount += 1;
    return acc;
  }, {} as Record<string, { name: string; averageUsage: number; itemCount: number }>);

  const departmentUsageData = Object.values(departmentUsage).map(dept => ({
    name: dept.name.charAt(0).toUpperCase() + dept.name.slice(1),
    value: dept.averageUsage / dept.itemCount
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Purchase History & Usage Analysis
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="kitchen">Kitchen</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage by Department */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Usage by Department</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {departmentUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Item Usage Trends */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Item Usage Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="itemName" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usagePercentage" name="Usage %" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Low Stock Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Threshold</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  {usageData
                    .filter(item => item.quantity <= item.threshold)
                    .map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.department}</td>
                        <td className="px-6 py-4 text-right">{item.quantity}</td>
                        <td className="px-6 py-4 text-right">{item.threshold}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            item.usagePercentage > 80 ? 'bg-red-100 text-red-800' :
                            item.usagePercentage > 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.usagePercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryAnalysis;