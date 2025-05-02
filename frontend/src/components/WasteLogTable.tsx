import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import wasteApi from '../utils/wasteApi';

interface WasteLog {
  _id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  recordedBy?: { name: string } | null;
}

interface WasteLogTableProps {
  dateStart?: string;
  dateEnd?: string;
  search?: string;
  category?: string;
  onGenerateReport?: () => void; // Added prop for report generation
}

const WasteLogTable: React.FC<WasteLogTableProps> = ({ dateStart, dateEnd, search, category, onGenerateReport }) => {
  const [wasteItems, setWasteItems] = useState<WasteLog[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WasteLog | 'recordedBy.name';
    direction: 'asc' | 'desc' | null;
  }>({ key: 'date', direction: 'desc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch waste logs
  useEffect(() => {
    const fetchWasteLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (dateStart) params.append('dateStart', dateStart);
        if (dateEnd) params.append('dateEnd', dateEnd);
        if (search) params.append('search', search);
        if (category && category !== 'all') params.append('category', category);
        console.log('Fetching waste logs with params:', params.toString());
        const response = await wasteApi.get(`/?${params.toString()}`);
        setWasteItems(response.data);
      } catch (err: any) {
        console.error('Error fetching waste logs:', err);
        setError(err.response?.data?.msg || 'Failed to fetch waste logs');
      } finally {
        setLoading(false);
      }
    };
    fetchWasteLogs();
  }, [dateStart, dateEnd, search, category]);

  // Sorting logic
  const sortedItems = [...wasteItems].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const key = sortConfig.key;
    if (key === 'recordedBy.name') {
      const nameA = a.recordedBy?.name || '';
      const nameB = b.recordedBy?.name || '';
      return sortConfig.direction === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    if (key === 'date') {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (key === 'quantity') {
      return sortConfig.direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    }
    return sortConfig.direction === 'asc'
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });

  const handleSort = (key: keyof WasteLog | 'recordedBy.name') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Generate CSV report
  const generateReport = () => {
    console.log('Generating report with items:', sortedItems);
    const headers = ['Item Name', 'Category', 'Quantity', 'Unit', 'Reason', 'Date Logged', 'Recorded By'];
    const csvRows = [
      headers.join(','),
      ...sortedItems.map((item) =>
        [
          `"${item.item}"`,
          item.category,
          item.quantity,
          item.unit,
          item.reason,
          new Date(item.date).toLocaleDateString(),
          `"${item.recordedBy?.name || 'Unknown'}"`,
        ].join(',')
      ),
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `waste_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger report generation via prop
  if (onGenerateReport) {
    onGenerateReport(generateReport);
  }

  if (loading) {
    return <div className="text-center py-6">Loading waste logs...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('item')}
              >
                <div className="flex items-center gap-1">
                  Item Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center gap-1">
                  Quantity
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('reason')}
              >
                <div className="flex items-center gap-1">
                  Reason
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date Logged
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
                onClick={() => handleSort('recordedBy.name')}
              >
                <div className="flex items-center gap-1">
                  Recorded By
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.item}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 capitalize">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.quantity} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.reason === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : item.reason === 'spoiled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.reason === 'damaged'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.reason}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.recordedBy?.name || 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {wasteItems.length === 0 && (
        <p className="text-center text-gray-500 py-6">No waste items logged yet.</p>
      )}
    </div>
  );
};

export default WasteLogTable;