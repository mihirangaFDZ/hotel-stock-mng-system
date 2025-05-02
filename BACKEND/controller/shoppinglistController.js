const Shopping = require('../models/shopping-list/ShoppingList');

// Get all shopping list items
const getShoppingList = async (req, res) => {
  try {
    const items = await Shopping.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new item to the shopping list
const addItem = async (req, res) => {
  const { name, threshold, currentStock } = req.body;

  // Validate input
  if (!name || threshold === undefined || currentStock === undefined) {
    return res.status(400).json({ message: 'Please provide name, threshold, and current stock' });
  }

  // Validate name (only letters, spaces, and hyphens allowed)
  const nameRegex = /^[A-Za-z\s-]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Item name can only contain letters, spaces, and hyphens (no numbers)' });
  }

  // Validate threshold and currentStock
  if (threshold < 0 || currentStock < 0) {
    return res.status(400).json({ message: 'Threshold and current stock must be non-negative numbers' });
  }

  try {
    const newItem = new Shopping({
      name,
      quantity: 0, // Default quantity
      threshold,
      currentStock,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an item (adjust quantity or edit fields)
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { increment, quantity, threshold, currentStock } = req.body;

  try {
    const item = await Shopping.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // If increment is provided, adjust the quantity
    if (typeof increment === 'boolean') {
      item.quantity = increment ? item.quantity + 1 : Math.max(0, item.quantity - 1);
    }
    // If quantity, threshold, or currentStock are provided, update those fields
    else if (quantity !== undefined || threshold !== undefined || currentStock !== undefined) {
      if (quantity !== undefined) {
        if (quantity < 0) {
          return res.status(400).json({ message: 'Quantity cannot be negative' });
        }
        item.quantity = quantity;
      }
      if (threshold !== undefined) {
        if (threshold < 0) {
          return res.status(400).json({ message: 'Threshold cannot be negative' });
        }
        item.threshold = threshold;
      }
      if (currentStock !== undefined) {
        if (currentStock < 0) {
          return res.status(400).json({ message: 'Current stock cannot be negative' });
        }
        item.currentStock = currentStock;
      }
    } else {
      return res.status(400).json({ message: 'Invalid request: provide increment or edit fields' });
    }

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an item from the shopping list
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Shopping.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.remove();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getShoppingList,
  addItem,
  updateItem,
  deleteItem,
};