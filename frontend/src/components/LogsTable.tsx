import React from 'react';
import { ArrowUpDown } from 'lucide-react';

// Define InventoryLog type inline
interface InventoryLog {
  id: string;
  userName: string;
  userRole: 'Manager' | 'Staff' | 'Admin'; // Matches InventoryLoggs.tsx
  itemName: string;
  changeType: 'Added' | 'Adjusted' | 'Removed';
  previousQuantity: number;
  newQuantity: number;
  unit: 'kg' | 'liters' | 'count';
  timestamp: string;
  deviceInfo: string; // Included for type consistency
  ipAddress: string; // Included for type consistency
  reason?: string; // Optional, matches InventoryLoggs.tsx
}

interface LogsTableProps {
  logs: InventoryLog[];
  onSort: (field: keyof InventoryLog) => void;
  onRowClick: (log: InventoryLog) => void;
}

// Embedded mock data (for demonstration or fallback)
const mockLogs: InventoryLog[] = [
  {
    id: '1',
    userName: 'Jane Smith',
    userRole: 'Manager',
    itemName: 'Milk',
    changeType: 'Added',
    previousQuantity: 10,
    newQuantity: 25,
    unit: 'liters',
    timestamp: '2025-03-26T14:30:00Z',
    deviceInfo: 'Windows 10 (Chrome)',
    ipAddress: '192.168.1.150',
  },
  {
    id: '2',
    userName: 'John Doe',
    userRole: 'Staff',
    itemName: 'Bread',
    changeType: 'Removed',
    previousQuantity: 5,
    newQuantity: 0,
    unit: 'kg',
    timestamp: '2025-03-25T09:15:00Z',
    deviceInfo: 'MacBook (Safari)',
    ipAddress: '192.168.1.100',
  },
  {
    id: '3',
    userName: 'Alice Brown',
    userRole: 'Admin',
    itemName: 'Napkins',
    changeType: 'Adjusted',
    previousQuantity: 150,
    newQuantity: 100,
    unit: 'count',
    timestamp: '2025-03-24T11:45:00Z',
    deviceInfo: 'Linux (Firefox)',
    ipAddress: '192.168.1.200',
  },
];

export const LogsTable: React.FC<LogsTableProps> = ({
  logs = mockLogs, // Use mockLogs as fallback if no logs provided
  onSort,
  onRowClick,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
              onClick={() => onSort('userName')}
            >
              <div className="flex items-center">
                User Name / Role
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
              onClick={() => onSort('itemName')}
            >
              <div className="flex items-center">
                Item Name
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
              onClick={() => onSort('changeType')}
            >
              <div className="flex items-center">
                Change Type
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
              onClick={() => onSort('newQuantity')}
            >
              <div className="flex items-center">
                Quantity Change
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600"
              onClick={() => onSort('timestamp')}
            >
              <div className="flex items-center">
                Timestamp
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => onRowClick(log)}
                className="hover:bg-teal-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {log.userName || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {log.userRole || 'No Role'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {log.itemName || 'Unnamed Item'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.changeType === 'Added'
                        ? 'bg-teal-100 text-teal-800'
                        : log.changeType === 'Adjusted'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.changeType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {log.previousQuantity} {log.unit} → {log.newQuantity} {log.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};