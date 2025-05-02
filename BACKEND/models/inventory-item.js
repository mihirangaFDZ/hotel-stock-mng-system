const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  supplier: {
    type: String,
    required: true,
  },
});

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
    enum: ["kitchen", "housekeeping", "maintenance", "all"],
    default: "all",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseHistory: [purchaseHistorySchema],
  reorderPoint: {
    type: Number,
    required: true,
    min: 0,
  },
  description: String,
  expiryDate: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add virtual for total spent
inventoryItemSchema.virtual("totalSpent").get(function () {
  return this.purchaseHistory.reduce(
    (total, purchase) => total + purchase.quantity * purchase.price,
    0
  );
});

// Add virtual for budget utilization
inventoryItemSchema.virtual("budgetUtilization").get(function () {
  return this.budget > 0 ? (this.totalSpent / this.budget) * 100 : 0;
});

// Ensure virtuals are included in JSON output
inventoryItemSchema.set("toJSON", { virtuals: true });
inventoryItemSchema.set("toObject", { virtuals: true });

inventoryItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;
