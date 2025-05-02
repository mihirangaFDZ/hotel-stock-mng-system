const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  whatsapp: { type: String, required: true },
  items: { type: [String], required: true }, // Array of items supplied
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);