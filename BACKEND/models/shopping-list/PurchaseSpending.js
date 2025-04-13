const mongoose = require('mongoose');

const PurchaseSpendingSchema = new mongoose.Schema({
  item: String,
  cost: Number,
  date: Date
});

module.exports = mongoose.model('PurchaseSpending', PurchaseSpendingSchema);
