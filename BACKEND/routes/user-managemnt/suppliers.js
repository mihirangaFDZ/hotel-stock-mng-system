const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Supplier = require('../../models/user-managemnt/Supplier');

// Middleware to verify JWT token and admin role
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied, admin only' });
    }
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Create Supplier (admin only)
router.post('/suppliers', authMiddleware, async (req, res) => {
  const { name, email, whatsapp, items } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !whatsapp || !items || !Array.isArray(items)) {
      return res.status(400).json({ msg: 'Name, email, whatsapp, and items are required' });
    }

    let supplier = await Supplier.findOne({ email });
    if (supplier) return res.status(400).json({ msg: 'Supplier already exists' });

    supplier = new Supplier({
      name,
      email,
      whatsapp,
      items,
    });

    await supplier.save();
    res.status(201).json({ msg: 'Supplier created', supplier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get All Suppliers (admin only)
router.get('/suppliers', authMiddleware, async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Supplier (admin only)
router.put('/suppliers/:id', authMiddleware, async (req, res) => {
  const { name, email, whatsapp, items } = req.body;

  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ msg: 'Supplier not found' });

    // Check for duplicate email (excluding current supplier)
    if (email && email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ email });
      if (existingSupplier) return res.status(400).json({ msg: 'Email already in use' });
    }

    // Update fields if provided
    supplier.name = name || supplier.name;
    supplier.email = email || supplier.email;
    supplier.whatsapp = whatsapp || supplier.whatsapp;
    supplier.items = items && Array.isArray(items) ? items : supplier.items;

    await supplier.save();
    res.status(200).json({ msg: 'Supplier updated', supplier });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete Supplier (admin only)
router.delete('/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ msg: 'Supplier not found' });

    await supplier.deleteOne();
    res.status(200).json({ msg: 'Supplier deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;