const express = require('express');
const inventoryController = require('../controller/inventoryController');
const router = express.Router();
const inventory = require('../models/inventory-item');
 
//routes and connect to the controllers
router.post('/', inventoryController.addInventoryItem);
router.get('/', inventoryController.getAllInventoryItems);
router.get('/:id', inventoryController.getInventoryItemById);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);
router.get('/total-products', inventoryController.getTotalItems);
router.get('/total-categories', inventoryController.getAllCategories);
router.get('/monthly-spending', inventoryController.getMonthlySpending);


module.exports = router;