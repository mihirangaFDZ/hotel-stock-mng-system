import { ArrowUpDown, Filter, Package, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Constants and Configuration
const API_URL = "http://localhost:8070/api/inventory/";

const CATEGORIES = [
    "All",
    "Household",
    "Cleaning",
    "Personal Care",
    "Electronics",
    "Food",
];
const DEPARTMENTS = [
    "All",
    "Kitchen Cabinet",
    "Under Sink",
    "Laundry Room",
    "Utility Drawer",
    "Storage Closet",
    "Bathroom",
    "Bathroom Cabinet",
];

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

const LowStockItems: React.FC = () => {
    // State
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [sortField, setSortField] = useState<keyof InventoryItem>("itemName");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
            // Filter for low stock items (quantity < threshold)
            const lowStockItems = response.data.filter(
                (item) => item.quantity < item.threshold
            );
            setInventory(lowStockItems);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to fetch low stock items" });
            console.error("Error fetching inventory:", err);
            toast.error("Failed to fetch low stock items");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleSort = (field: keyof InventoryItem) => {
        setSortField(field);
        setSortDirection((prev) =>
            sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc"
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(e.target.value);
    };

    // Filter and Sort Logic
    const filteredInventory = inventory
        .filter(
            (item) =>
                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedCategory === "All" || item.category === selectedCategory) &&
                (selectedDepartment === "All" || item.department === selectedDepartment)
        )
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (!aValue) return sortDirection === "asc" ? 1 : -1;
            if (!bValue) return sortDirection === "asc" ? -1 : 1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortDirection === "asc"
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        });

    // Render
    return (
        <div className="container mx-auto px-4 py-6 fade-in">
            {/* Message Toast */}
            {message && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-500" : "bg-red-500"
                        } text-white`}
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
                    Low Stock Items
                </h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                        <Search className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-transparent border-none outline-none w-full"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            disabled={loading}
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <select
                            className="bg-gray-50 border-none rounded-lg px-3 py-2 w-full outline-none"
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            disabled={loading}
                        >
                            {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="text-right text-gray-500">
                        {filteredInventory.length} low stock items found
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            "itemName",
                                            "category",
                                            "quantity",
                                            "threshold",
                                            "unitType",
                                            "department",
                                            "expiryDate",
                                        ].map((field) => (
                                            <th
                                                key={field}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort(field as keyof InventoryItem)}
                                            >
                                                <div className="flex items-center">
                                                    {field.charAt(0).toUpperCase() +
                                                        field.slice(1).replace("Date", " Date")}
                                                    {sortField === field && (
                                                        <ArrowUpDown className="h-4 w-4 ml-1" />
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.itemName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.expiryDate
                                                    ? new Date(item.expiryDate).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredInventory.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No low stock items found. All items are above their threshold.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LowStockItems;