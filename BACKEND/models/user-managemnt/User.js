const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'housekeeping', 'supplier'],
    default: 'staff',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  whatsapp: { type: String },
  inventory: { type: [String] }, // For suppliers
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);