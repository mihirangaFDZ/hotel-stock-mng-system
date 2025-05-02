export interface InventoryLog {
    id: string;
    userName: string;
    userRole: 'Admin' | 'Manager' | 'Staff';
    itemName: string;
    changeType: 'Added' | 'Updated' | 'Removed';
    previousQuantity: number;
    newQuantity: number;
    timestamp: string;
    deviceInfo: string;
    ipAddress: string;
    reason?: string;
  }
  
  export interface FilterState {
    search: string;
    dateRange: {
      start: string;
      end: string;
    };
    userRole: string;
    changeType: string;
  }
  
  export interface NewLogEntry {
    itemName: string;
    changeType: 'Added' | 'Updated' | 'Removed';
    quantity: number;
    reason: string;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    password: string; 
    role: 'staff' | 'manager' | 'admin' | 'supplier' | 'housekeeping';
    status: 'active' | 'inactive';
    whatsapp?: string;
    inventory?: string[];
  }
  
 
  export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
  }



