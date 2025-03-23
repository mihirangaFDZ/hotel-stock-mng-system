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
  location: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

inventoryItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;
