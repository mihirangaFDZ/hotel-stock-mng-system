// routes/shopping-list/purchaseBudgetRoutes.js
const express = require('express');
const router = express.Router();
const PurchaseBudget = require('../../models/shopping-list/PurchaseBudget'); // ✅ Import without redefining

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await PurchaseBudget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new budget
router.post('/', async (req, res) => {
  const { category, amount, date } = req.body;
  const newBudget = new PurchaseBudget({ category, amount, date });

  try {
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
