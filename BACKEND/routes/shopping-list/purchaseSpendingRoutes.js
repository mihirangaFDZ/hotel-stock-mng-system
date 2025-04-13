const express = require('express');
const router = express.Router();
const PurchaseSpending = require('../../models/shopping-list/PurchaseSpending');


// Get all spendings
router.get('/', async (req, res) => {
  try {
    const spendings = await PurchaseSpending.find();
    res.json(spendings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new spending
router.post('/', async (req, res) => {
  const { item, cost, date } = req.body;
  const newSpending = new PurchaseSpending({ item, cost, date });

  try {
    await newSpending.save();
    res.status(201).json(newSpending);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
