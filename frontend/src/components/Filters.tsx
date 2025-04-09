import React from 'react';
import { Search, Plus } from 'lucide-react';

// Define FilterState type inline
interface FilterState {
  search: string;
  userRole: string;
  changeType: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onExport: () => void;
  onAddNew: () => void;
}

// Embedded mock initial filters (for demonstration or fallback)
const defaultFilters: FilterState = {
  search: '',
  userRole: '',
  changeType: '',
  dateRange: {
    start: '2025-03-01',
    end: '2025-03-26', // Matches current date (March 26, 2025)
  },
};

export const Filters: React.FC<FiltersProps> = ({
  filters = defaultFilters, // Use default if no filters provided
  onFilterChange,
  onExport,
  onAddNew,
}) => {
  // Use a type-safe handleChange with generics
  const handleChange = <K extends keyof FilterState>(
    field: K,
    value: FilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-6">
      {/* Top Row: Search, Role, Change Type */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by item or user (e.g., Milk, Jane)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            value={filters.userRole}
            onChange={(e) => handleChange('userRole', e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            value={filters.changeType}
            onChange={(e) => handleChange('changeType', e.target.value)}
          >
            <option value="">All Changes</option>
            <option value="Added">Added</option>
            <option value="Adjusted">Adjusted</option>
            <option value="Removed">Removed</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Date Range, Buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            value={filters.dateRange.start}
            onChange={(e) =>
              handleChange('dateRange', { ...filters.dateRange, start: e.target.value })
            }
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            value={filters.dateRange.end}
            onChange={(e) =>
              handleChange('dateRange', { ...filters.dateRange, end: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
            onClick={onAddNew}
          >
            <Plus className="h-5 w-5 mr-1" />
            Add New
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={onExport}
          >
            Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};