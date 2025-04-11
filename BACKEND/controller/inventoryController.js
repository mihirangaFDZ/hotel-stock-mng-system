const InventoryItem = require( "../models/inventory-item");

// creat an inventory item
const addInventoryItem = async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(200).json(newItem);
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

//get total number of products 
const getTotalItems = async (req, res) => {
  console.log("fetching...")
  try {
    const totalItems = await InventoryItem.countDocuments();
    res.status(200).json({ totalItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await InventoryItem.distinct("category");
    res.json({ totalCategories: categories.length });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

const getMonthlySpending = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalSpending = await InventoryItem.aggregate([
      { $match: { updatedAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    res.json({ totalSpending: totalSpending.length > 0 ? totalSpending[0].total : 0 });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};




// Exporting the controller functions

module.exports = {
  getTotalItems,
  getAllCategories,
  getMonthlySpending,
  addInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem

};