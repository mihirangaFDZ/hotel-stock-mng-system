import React, { useState, useRef } from 'react';
import WasteLoggingForm from '../../components/WasteLoggingForm';
import WasteAnalytics from '../../components/WasteAnalytics';
import WasteLogTable from '../../components/WasteLogTable';
import { BarChart3, ClipboardList, LineChart, RefreshCw, Download } from 'lucide-react';

function Wastemanagement() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const generateReportRef = useRef<() => void>(() => {});

  const resetFilters = () => {
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
    setSelectedCategory('all');
    setFiltersApplied(false);
    setRefreshKey((prev) => prev + 1);
  };

  const applyFilters = () => {
    setFiltersApplied(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleGenerateReport = () => {
    if (generateReportRef.current) {
      generateReportRef.current();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-semibold text-indigo-800">
                Hotel Waste Management
              </h1>
            </div>
            <span className="text-sm text-indigo-600">
              Track and manage waste efficiently
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* Analytics Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 text-indigo-600" />
              <h2 className="ml-2 text-xl font-bold text-indigo-800">Analytics Overview</h2>
            </div>
            <p className="text-sm text-indigo-600 mb-4">
              Visualize waste trends and insights
            </p>
            <WasteAnalytics
              key={`analytics-${refreshKey}`}
              dateStart={dateRange.start}
              dateEnd={dateRange.end}
            />
          </section>

          {/* Waste Logging Form Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <ClipboardList className="h-6 w-6 text-indigo-600" />
              <h2 className="ml-2 text-xl font-bold text-indigo-800">Log Waste</h2>
            </div>
            <p className="text-sm text-indigo-600 mb-4">
              Add new waste entries quickly and easily
            </p>
            <WasteLoggingForm />
          </section>

          {/* Waste Logs Section */}
          <section className="bg-white rounded-xl shadow-sm p-6 border border-indigo-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-indigo-800">Waste Logs</h2>
                <span className="ml-2 text-sm text-indigo-600">
                  ({filtersApplied ? 'Filters Applied' : 'All Entries'})
                </span>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                title="Reset all filters"
              >
                <RefreshCw className="h-5 w-5 mr-1" /> Reset
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Search Items
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bread"
                  className="w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all"
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

            {/* Filter and Report Buttons */}
            <div className="flex justify-end gap-4 mb-4">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>

            <WasteLogTable
              key={`table-${refreshKey}`}
              dateStart={dateRange.start}
              dateEnd={dateRange.end}
              search={searchTerm}
              category={selectedCategory}
              onGenerateReport={(generateReport) => {
                generateReportRef.current = generateReport;
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Wastemanagement;