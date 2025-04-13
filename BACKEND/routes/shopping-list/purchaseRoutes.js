const express = require("express");
const Purchase = require("./../../models/shopping-list/Purchase");

const router = express.Router();

// Create a purchase
router.post("/", async (req, res) => {
    try {
        const newPurchase = new Purchase(req.body);
        await newPurchase.save();
        res.status(201).json(newPurchase);
    } catch (error) {
        res.status(500).json({ message: "Error saving purchase" });
    }
});

// Get all purchases
router.get("/", async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: "Error fetching purchases" });
    }
});

module.exports = router;
