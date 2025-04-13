const express = require('express');
const router = express.Router();
const Item = require('../../models/shopping-list/ShoppingList');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item
router.post('/', async (req, res) => {
  const { name, threshold, currentStock } = req.body;
  const quantity = Math.max(0, threshold - currentStock);

  const item = new Item({
    name,
    quantity,
    threshold,
    currentStock,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, threshold, currentStock } = req.body;
  const nameRegex = /^[A-Za-z\s-]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ message: 'Item name can only contain letters, spaces, and hyphens (no numbers)' });
  }
  // Proceed with saving the item
});

// In routes/items.js (or wherever your route is defined)
router.put('/:id', async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      const { increment, quantity, threshold, currentStock } = req.body;
  
      if (typeof increment === 'boolean') {
        // Handle increment/decrement for Plus/Minus buttons
        item.quantity = increment ? item.quantity + 1 : Math.max(0, item.quantity - 1);
      } else if (quantity !== undefined || threshold !== undefined || currentStock !== undefined) {
        // Handle full edit from the edit form
        item.quantity = quantity !== undefined ? quantity : item.quantity;
        item.threshold = threshold !== undefined ? threshold : item.threshold;
        item.currentStock = currentStock !== undefined ? currentStock : item.currentStock;
      } else {
        return res.status(400).json({ message: 'Invalid request: provide increment or edit fields' });
      }
  
      const updatedItem = await item.save();
      res.json(updatedItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;