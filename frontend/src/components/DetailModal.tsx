import React from 'react';
import { X } from 'lucide-react';

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

interface DetailModalProps {
  log: InventoryLog | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Inventory Change Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">User Information</h3>
            <p className="mt-1">{log.userName} ({log.userRole})</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Item Modified</h3>
            <p className="mt-1">{log.itemName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Change Details</h3>
            <p className="mt-1">
              {log.changeType}: {log.previousQuantity} {log.unit} →{' '}
              {log.newQuantity} {log.unit}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Time</h3>
            <p className="mt-1">{new Date(log.timestamp).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Device Information</h3>
            <p className="mt-1">{log.deviceInfo}</p>
            <p className="text-sm text-gray-500">IP: {log.ipAddress}</p>
          </div>

          {log.reason && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Reason</h3>
              <p className="mt-1">{log.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};