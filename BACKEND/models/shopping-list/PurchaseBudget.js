// models/shopping-list/PurchaseBudget.js

const mongoose = require('mongoose');

const PurchaseBudgetSchema = new mongoose.Schema({
  category: String,
  budget: Number,
  spent: Number
});

// Prevent overwriting the model
module.exports = mongoose.models.PurchaseBudget || mongoose.model('PurchaseBudget', PurchaseBudgetSchema);
