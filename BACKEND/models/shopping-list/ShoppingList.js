const mongoose = require('mongoose');

const shoppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  threshold: {
    type: Number,
    required: true,
  },
  currentStock: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Shopping', shoppingSchema);