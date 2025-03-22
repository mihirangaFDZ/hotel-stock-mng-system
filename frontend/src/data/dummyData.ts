export interface StockItem {
  id: number;
  item: string;
  category: string;
  quantity: number;
  threshold: number;
  supplier: string;
  supplierPhone: string;
  trend: 'up' | 'down' | 'stable';
  lastRestock: string;
  usageRate: number; // Units per day
  predictedDepletion: string; // Predicted date
}

export interface ChatMessage {
  id: number;
  supplier: string;
  sender: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  aiSuggested?: boolean;
}

export interface Notification {
  id: number;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  relatedStockId?: number;
  channel: 'email' | 'whatsapp' | 'in-app';
}

export const stockData: StockItem[] = [
  { id: 1, item: "Luxury Bath Towels", category: "Linens", quantity: 120, threshold: 200, supplier: "Elite Textiles", supplierPhone: "+12025550123", trend: 'down', lastRestock: "2025-03-10", usageRate: 15, predictedDepletion: "2025-03-28" },
  { id: 2, item: "Hand Soap Dispensers", category: "Toiletries", quantity: 300, threshold: 400, supplier: "PureClean", supplierPhone: "+12025550124", trend: 'stable', lastRestock: "2025-03-15", usageRate: 25, predictedDepletion: "2025-04-05" },
  { id: 3, item: "King Bedsheets", category: "Linens", quantity: 80, threshold: 150, supplier: "DreamWeave", supplierPhone: "+12025550125", trend: 'down', lastRestock: "2025-03-12", usageRate: 10, predictedDepletion: "2025-03-25" },
  { id: 4, item: "Shampoo 50ml", category: "Toiletries", quantity: 500, threshold: 700, supplier: "PureClean", supplierPhone: "+12025550124", trend: 'up', lastRestock: "2025-03-20", usageRate: 40, predictedDepletion: "2025-04-10" },
  { id: 5, item: "Pillowcases (Silk)", category: "Linens", quantity: 60, threshold: 100, supplier: "DreamWeave", supplierPhone: "+12025550125", trend: 'down', lastRestock: "2025-03-08", usageRate: 5, predictedDepletion: "2025-03-22" },
  { id: 6, item: "Toilet Paper (Premium)", category: "Toiletries", quantity: 1000, threshold: 1500, supplier: "PureClean", supplierPhone: "+12025550124", trend: 'stable', lastRestock: "2025-03-18", usageRate: 80, predictedDepletion: "2025-04-15" },
  { id: 7, item: "Face Towels", category: "Linens", quantity: 200, threshold: 300, supplier: "Elite Textiles", supplierPhone: "+12025550123", trend: 'down', lastRestock: "2025-03-14", usageRate: 20, predictedDepletion: "2025-03-30" },
  { id: 8, item: "Conditioner 50ml", category: "Toiletries", quantity: 450, threshold: 600, supplier: "PureClean", supplierPhone: "+12025550124", trend: 'up', lastRestock: "2025-03-19", usageRate: 35, predictedDepletion: "2025-04-08" },
  { id: 9, item: "Bathrobes (Large)", category: "Linens", quantity: 40, threshold: 80, supplier: "Elite Textiles", supplierPhone: "+12025550123", trend: 'down', lastRestock: "2025-03-11", usageRate: 4, predictedDepletion: "2025-03-26" },
  { id: 10, item: "Body Lotion 30ml", category: "Toiletries", quantity: 600, threshold: 800, supplier: "PureClean", supplierPhone: "+12025550124", trend: 'stable', lastRestock: "2025-03-17", usageRate: 50, predictedDepletion: "2025-04-12" },
];

export const chatData: ChatMessage[] = [
  { id: 1, supplier: "Elite Textiles", sender: "Bot", text: "Luxury Bath Towels low (120/200). Need 100 units by 2025-03-25.", timestamp: "2025-03-21 09:00", status: 'read' },
  { id: 2, supplier: "Elite Textiles", sender: "Elite Textiles", text: "Confirmed, delivery scheduled for 2025-03-24.", timestamp: "2025-03-21 09:05", status: 'delivered' },
  { id: 3, supplier: "DreamWeave", sender: "Bot", text: "King Bedsheets low (80/150). Requesting 70 units.", timestamp: "2025-03-21 09:10", status: 'sent', aiSuggested: true },
  { id: 4, supplier: "PureClean", sender: "Bot", text: "Toilet Paper low (1000/1500). Need 500 rolls ASAP.", timestamp: "2025-03-21 09:15", status: 'delivered' },
];

export const notifications: Notification[] = [
  { id: 1, message: "Luxury Bath Towels below threshold (120/200)", priority: 'high', timestamp: "2025-03-21 08:55", relatedStockId: 1, channel: 'whatsapp' },
  { id: 2, message: "Elite Textiles confirmed delivery for 2025-03-24", priority: 'medium', timestamp: "2025-03-21 09:05", channel: 'in-app' },
  { id: 3, message: "King Bedsheets critically low (80/150)", priority: 'critical', timestamp: "2025-03-21 09:10", relatedStockId: 3, channel: 'email' },
];