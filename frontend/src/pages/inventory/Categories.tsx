import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, Package, AlertTriangle } from "lucide-react";

// Constants and Configuration
const API_URL = "http://localhost:8070/api/inventory/";

const CATEGORIES = ["Household", "Cleaning", "Personal Care", "Electronics", "Food"];
const CATEGORY_COLORS: { [key: string]: string } = {
    Household: "bg-blue-100 text-blue-800",
    Cleaning: "bg-green-100 text-green-800",
    "Personal Care": "bg-purple-100 text-purple-800",
    Electronics: "bg-yellow-100 text-yellow-800",
    Food: "bg-red-100 text-red-800",
};

// Types
interface InventoryItem {
    _id: string;
    itemName: string;
    category: string;
    quantity: number;
    unitType: string;
    department: string;
    expiryDate?: string;
    updatedAt?: string;
    lastDailyUsageUpdate?: string;
    price: number;
    currency: string;
    threshold: number;
}

interface Message {
    type: "success" | "error";
    text: string;
}

interface CategoryData {
    items: InventoryItem[];
    totalItems: number;
    totalQuantity: number;
    lowStockItems: number;
}

const Categories: React.FC = () => {
    // State
    const [categoryData, setCategoryData] = useState<{ [key: string]: CategoryData }>({});
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
        Household: true,
        Cleaning: true,
        "Personal Care": true,
        Electronics: true,
        Food: true,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    // Effects
    useEffect(() => {
        fetchInventory();
    }, []);

    // API Calls
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get<InventoryItem[]>(API_URL);
            const inventory = response.data;

            // Process data by category
            const data: { [key: string]: CategoryData } = {};
            CATEGORIES.forEach((category) => {
                const items = inventory.filter((item) => item.category === category);
                const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
                const lowStockItems = items.filter((item) => item.quantity < item.threshold).length;

                data[category] = {
                    items,
                    totalItems: items.length,
                    totalQuantity,
                    lowStockItems,
                };
            });

            setCategoryData(data);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to fetch inventory data" });
            console.error("Error fetching inventory:", err);
            toast.error("Failed to fetch inventory data");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    // Render
    return (
        <div className="container mx-auto px-4 py-6 fade-in">
           
            {/* Message Toast */}
            {message && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-500" : "bg-red-500"
                        } text-white shadow-lg transition-all duration-300`}
                >
                    {message.text}
                    <button className="ml-2" onClick={() => setMessage(null)}>
                        ×
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                    Inventory by Category
                </h1>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                ) : (
                    CATEGORIES.map((category) => {
                        const data = categoryData[category] || {
                            items: [],
                            totalItems: 0,
                            totalQuantity: 0,
                            lowStockItems: 0,
                        };
                        const isExpanded = expandedCategories[category];

                        return (
                            <div
                                key={category}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                {/* Category Header */}
                                <div
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {category}
                                        </span>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {data.totalItems} Items
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Total Quantity: {data.totalQuantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {data.lowStockItems > 0 && (
                                            <div className="flex items-center text-red-600">
                                                <AlertTriangle className="h-5 w-5 mr-1" />
                                                <span className="text-sm font-medium">
                                                    {data.lowStockItems} Low Stock
                                                </span>
                                            </div>
                                        )}
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>
                                </div>

                                {/* Category Items */}
                                {isExpanded && (
                                    <div className="p-4">
                                        {data.items.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Item Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Quantity
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Threshold
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Unit Type
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Department
                                                            </th>
                                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {data.items.map((item) => {
                                                            const isLowStock = item.quantity < item.threshold;
                                                            const isCritical = item.quantity === 0;
                                                            return (
                                                                <tr
                                                                    key={item._id}
                                                                    className={`hover:bg-gray-50 transition-colors duration-200 ${isCritical
                                                                            ? "bg-red-50"
                                                                            : isLowStock
                                                                                ? "bg-yellow-50"
                                                                                : "bg-white"
                                                                        }`}
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {item.itemName}
                                                                    </td>
                                                                    <td
                                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isCritical
                                                                                ? "text-red-600"
                                                                                : isLowStock
                                                                                    ? "text-yellow-600"
                                                                                    : "text-gray-900"
                                                                            }`}
                                                                    >
                                                                        {item.quantity}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {item.threshold}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {item.unitType}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {item.department}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                        <Link
                                                                            to={`/update-item/${item._id}`}
                                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                                        >
                                                                            Edit
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items in this category.
                                            </div>
                                        )}
                                        <div className="mt-4 text-right">
                                            <Link
                                                to={`/all-products?category=${category}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                            >
                                                View All {category} Items
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Categories;