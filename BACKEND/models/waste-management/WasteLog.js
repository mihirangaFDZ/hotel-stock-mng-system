const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'beverages', 'supplies'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'liters', 'count'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: ['expired', 'spoiled', 'damaged', 'other'],
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recorder is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('WasteLog', wasteLogSchema);