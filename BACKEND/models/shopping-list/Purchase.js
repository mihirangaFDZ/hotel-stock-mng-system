const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
