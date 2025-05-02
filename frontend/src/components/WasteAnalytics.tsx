import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import wasteApi from '../utils/wasteApi';

interface WasteAnalyticsProps {
  dateStart?: string;
  dateEnd?: string;
}

const WasteAnalytics: React.FC<WasteAnalyticsProps> = ({ dateStart, dateEnd }) => {
  const [analyticsData, setAnalyticsData] = useState<{
    totalKg: number;
    totalLiters: number;
    totalCount: number;
    mostDiscardedItems: { item: string; quantity: number; unit: string; category: string }[];
    wasteByReason: { reason: string; percentage: number }[];
    wasteByCategory: { category: string; total: number; unit: string }[];
  } | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (dateStart) params.append('dateStart', dateStart);
        if (dateEnd) params.append('dateEnd', dateEnd);
        const response = await wasteApi.get(`/analytics?${params.toString()}`);
        setAnalyticsData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.response?.data?.msg || 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateStart, dateEnd]);

  if (loading) {
    return <div className="text-center py-6">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-600">{error}</div>;
  }

  if (!analyticsData) {
    return <div className="text-center py-6">No analytics data available.</div>;
  }

  const visibleItems = showAllItems
    ? analyticsData.mostDiscardedItems
    : analyticsData.mostDiscardedItems.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Waste Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Waste Statistics {dateStart && dateEnd ? `(${dateStart} to ${dateEnd})` : '(Last 30 Days)'}
          </h3>
          <span title="Data based on recorded waste" className="cursor-help">
            <Info className="h-5 w-5 text-gray-400" />
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xl font-bold text-teal-600">{analyticsData.totalKg.toFixed(1)} kg</div>
            <p className="text-sm text-gray-600">Total Solids</p>
          </div>
          <div>
            <div className="text-xl font-bold text-teal-600">{analyticsData.totalLiters.toFixed(1)} liters</div>
            <p className="text-sm text-gray-600">Total Liquids</p>
          </div>
          <div>
            <div className="text-xl font-bold text-teal-600">{analyticsData.totalCount.toFixed(0)} </div>
            <p className="text-sm text-gray-600">Total Count</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Most Discarded Items</h4>
          <ul className="space-y-3">
            {visibleItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm text-gray-700">
                <span>{item.item} ({item.category})</span>
                <span className="font-medium text-teal-600">
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
          {analyticsData.mostDiscardedItems.length > 3 && (
            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="mt-3 flex items-center text-teal-600 hover:text-teal-800 transition-colors text-sm"
            >
              {showAllItems ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show More
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Waste by Reason and Category Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Waste Breakdown</h3>
          <span title="Breakdown of waste by reason and category" className="cursor-help">
            <Info className="h-5 w-5 text-gray-400" />
          </span>
        </div>

        {/* Waste by Reason */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">By Reason</h4>
          <div className="space-y-4">
            {analyticsData.wasteByReason.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{stat.reason}</span>
                  <span className="font-medium">{stat.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste by Category */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">By Category</h4>
          <ul className="space-y-3">
            {analyticsData.wasteByCategory.map((cat, index) => (
              <li key={index} className="flex justify-between items-center text-sm text-gray-700">
                <span>{cat.category}</span>
                <span className="font-medium text-teal-600">
                  {cat.total} {cat.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="col-span-1 lg:col-span-2 text-center text-xs text-gray-500 mt-4">
        Data sourced from hotel records | Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default WasteAnalytics;