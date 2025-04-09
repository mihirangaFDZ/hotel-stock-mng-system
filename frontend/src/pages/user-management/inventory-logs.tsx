import React, { useState } from 'react';
import { LogsTable } from '../../components/LogsTable';
import { DetailModal } from '../../components/DetailModal';
import { AddLogModal } from '../../components/AddLogModal';
import { Filters } from '../../components/Filters';
import { ClipboardList } from 'lucide-react';

// Define types inline
interface InventoryLog {
  id: string;
  userName: string;
  userRole: 'Manager' | 'Staff' | 'Admin';
  itemName: string;
  changeType: 'Added' | 'Adjusted' | 'Removed';
  previousQuantity: number;
  newQuantity: number;
  unit: 'kg' | 'liters' | 'count';
  timestamp: string;
  deviceInfo: string;
  ipAddress: string;
  reason?: string;
}

interface FilterState {
  search: string;
  userRole: string;
  changeType: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface NewLogEntry {
  itemName: string;
  changeType: 'Added' | 'Adjusted' | 'Removed';
  quantity: number;
  reason: string;
  unit: 'kg' | 'liters' | 'count';
}

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

function InventoryLoggs() {
  const [logs, setLogs] = useState<InventoryLog[]>(mockLogs);
  const [selectedLog, setSelectedLog] = useState<InventoryLog | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateRange: {
      start: '',
      end: '',
    },
    userRole: '',
    changeType: '',
  });

  const currentUser = {
    name: 'Dakshina R',
    role: 'Admin' as const,
  };

  const handleSort = (field: keyof InventoryLog) => {
    const sortedLogs = [...logs].sort((a, b) => {
      if (field === 'timestamp') {
        return new Date(a[field]).getTime() - new Date(b[field]).getTime();
      } else if (field === 'previousQuantity' || field === 'newQuantity') {
        return a[field] - b[field];
      } else {
        return String(a[field]).localeCompare(String(b[field]));
      }
    });
    setLogs(sortedLogs);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    let filteredLogs = [...mockLogs];
    console.log('Initial logs:', filteredLogs); // Debug initial data

    if (newFilters.search) {
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.itemName.toLowerCase().includes(newFilters.search.toLowerCase()) ||
          log.userName.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    if (newFilters.userRole) {
      filteredLogs = filteredLogs.filter(
        (log) => log.userRole === newFilters.userRole
      );
    }

    if (newFilters.changeType) {
      filteredLogs = filteredLogs.filter(
        (log) => log.changeType === newFilters.changeType
      );
    }

    if (newFilters.dateRange.start) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) >= new Date(newFilters.dateRange.start)
      );
    }

    if (newFilters.dateRange.end) {
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.timestamp) <= new Date(newFilters.dateRange.end)
      );
    }

    console.log('Filtered logs:', filteredLogs); // Debug filtered data
    setLogs(filteredLogs);
  };

  const handleExport = () => {
    const headers = [
      'User Name',
      'Role',
      'Item Name',
      'Change Type',
      'Previous Quantity',
      'New Quantity',
      'Unit',
      'Timestamp',
      'Device Info',
    ];
    const csvContent = [
      headers.join(','),
      ...logs.map((log) =>
        [
          log.userName,
          log.userRole,
          log.itemName,
          log.changeType,
          log.previousQuantity,
          log.newQuantity,
          log.unit,
          new Date(log.timestamp).toLocaleString(),
          log.deviceInfo,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNewLog = (newLog: NewLogEntry) => {
    const log: InventoryLog = {
      id: Date.now().toString(),
      userName: currentUser.name,
      userRole: currentUser.role,
      itemName: newLog.itemName,
      changeType: newLog.changeType,
      previousQuantity: newLog.changeType === 'Added' ? 0 : newLog.quantity,
      newQuantity: newLog.changeType === 'Removed' ? 0 : newLog.quantity,
      unit: newLog.unit,
      timestamp: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
      ipAddress: '192.168.1.1',
      reason: newLog.reason,
    };
    setLogs([log, ...logs]);
  };

  const handleRowClick = (log: InventoryLog) => {
    setSelectedLog(log);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <ClipboardList className="h-8 w-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Modification Logs
          </h1>
        </div>

        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onAddNew={() => setShowAddModal(true)}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <LogsTable
            logs={logs}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
        </div>

        <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />

        {showAddModal && (
          <AddLogModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddNewLog}
          />
        )}
      </div>
    </div>
  );
}

export default InventoryLoggs;