const express = require('express');
const invetoryController = require('../controller/invetoryController');
const router = express.Router();
const inventory = require('../models/inventory-item');

//routes and connect to the controllers
router.post('/', invetoryController.addInventoryItem);
router.get('/', invetoryController.getAllInventoryItems);
router.get('/:id', invetoryController.getInventoryItemById);
router.put('/:id', invetoryController.updateInventoryItem);
router.delete('/:id', invetoryController.deleteInventoryItem);

module.exports = router;