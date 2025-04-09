import React, { useState } from 'react';
import WasteLoggingForm from '../../components/WasteLoggingForm';
import WasteAnalytics from '../../components/WasteAnalytics';
import WasteLogTable from '../../components/WasteLogTable';
import { BarChart3, ClipboardList, LineChart, RefreshCw } from 'lucide-react';

function Wastemanagement() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Reset filters to default values
  const resetFilters = () => {
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
    setSelectedCategory('all');
    setFiltersApplied(false);
  };

  // Apply filters (for demonstration; actual filtering logic would be in WasteLogTable)
  const applyFilters = () => {
    setFiltersApplied(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-teal-600" />
              <h1 className="ml-3 text-2xl font-semibold text-gray-800">
                Hotel Waste Management
              </h1>
            </div>
            <span className="text-sm text-gray-500">
              Track and manage waste efficiently
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* Analytics Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 text-teal-600" />
              <h2 className="ml-2 text-xl font-bold text-gray-800">Analytics Overview</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Visualize waste trends and insights
            </p>
            <WasteAnalytics />
          </section>

          {/* Waste Logging Form Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <ClipboardList className="h-6 w-6 text-teal-600" />
              <h2 className="ml-2 text-xl font-bold text-gray-800">Log Waste</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add new waste entries quickly and easily
            </p>
            <WasteLoggingForm />
          </section>

          {/* Waste Logs Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800">Waste Logs</h2>
                <span className="ml-2 text-sm text-gray-500">
                  ({filtersApplied ? 'Filters Applied' : 'All Entries'})
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                title="Reset all filters"
              >
                <RefreshCw className="h-5 w-5 mr-1" /> Reset
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Items
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food Waste"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food</option>
                  <option value="beverages">Beverages</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>

            <WasteLogTable />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Wastemanagement;