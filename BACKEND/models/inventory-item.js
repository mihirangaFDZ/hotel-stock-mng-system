const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unitType: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
    min: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastDailyUsageUpdate: { type: Date },


});

inventoryItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;
