// models/shopping-list/PurchaseBudget.js

const mongoose = require('mongoose');

const PurchaseBudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  department: {
    type: String,
    enum: ['kitchen', 'housekeeping', 'maintenance', 'all'],
    default: 'all'
  }
});

// Add a virtual field for budget utilization percentage
PurchaseBudgetSchema.virtual('utilization').get(function() {
  return this.budget > 0 ? (this.spent / this.budget) * 100 : 0;
});

// Ensure virtuals are included in JSON output
PurchaseBudgetSchema.set('toJSON', { virtuals: true });
PurchaseBudgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.PurchaseBudget || mongoose.model('PurchaseBudget', PurchaseBudgetSchema);
