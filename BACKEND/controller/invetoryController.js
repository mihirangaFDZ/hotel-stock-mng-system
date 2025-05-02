const InventoryItem = require( "../models/inventory-item");

// creat an inventory item
const addInventoryItem = async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all inventory items
const getAllInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get an inventory item by id
const getInventoryItemById = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(404).json({ message: "Item not found" });
  }
};

//Update an Inventory Item**
const updateInventoryItem = async (req, res) => {
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete an Inventory Item**
const deleteInventoryItem = async (req, res) => {
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseBudgetData = async (req, res) => {
    try {
        const { range, department } = req.query;
        const query = department !== 'all' ? { department } : {};
        
        const items = await InventoryItem.find(query);
        const monthlyData = new Map();
        
        // Get date range
        const now = new Date();
        const startDate = new Date();
        switch(range) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        // Aggregate budget data by month
        items.forEach(item => {
            const purchases = item.purchaseHistory.filter(ph => 
                new Date(ph.date) >= startDate && new Date(ph.date) <= now
            );
            
            purchases.forEach(purchase => {
                const monthKey = new Date(purchase.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, { month: monthKey, budget: 0, spent: 0 });
                }
                const monthData = monthlyData.get(monthKey);
                monthData.budget += item.budget;
                monthData.spent += purchase.quantity * purchase.price;
            });
        });

        // Convert to array and sort by date
        const budgetData = Array.from(monthlyData.values())
            .sort((a, b) => new Date(a.month) - new Date(b.month));

        res.status(200).json(budgetData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPurchaseSpendingData = async (req, res) => {
    try {
        const { range, department } = req.query;
        const query = department !== 'all' ? { department } : {};
        
        const items = await InventoryItem.find(query);
        const purchasePatterns = [];

        // Get date range
        const now = new Date();
        const startDate = new Date();
        switch(range) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        // Aggregate spending data
        items.forEach(item => {
            const purchases = item.purchaseHistory.filter(ph => 
                new Date(ph.date) >= startDate && new Date(ph.date) <= now
            );
            
            if (purchases.length > 0) {
                purchasePatterns.push({
                    name: item.itemName,
                    purchases: purchases.length
                });
            }
        });

        // Sort by number of purchases
        purchasePatterns.sort((a, b) => b.purchases - a.purchases);

        res.status(200).json(purchasePatterns.slice(0, 10)); // Return top 10 most purchased items
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addInventoryItem = addInventoryItem;
exports.getAllInventoryItems = getAllInventoryItems;
exports.getInventoryItemById = getInventoryItemById;
exports.updateInventoryItem = updateInventoryItem;
exports.deleteInventoryItem = deleteInventoryItem;
exports.getPurchaseBudgetData = getPurchaseBudgetData;
exports.getPurchaseSpendingData = getPurchaseSpendingData;