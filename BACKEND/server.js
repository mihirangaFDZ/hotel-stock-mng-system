const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for frontend

// Routes
const inventoryRoutes = require('./routes/inventory-routes');
const shoppingListRoutes = require('./routes/shopping-list/shoppingListRoutes');
const purchaseRoutes = require('./routes/shopping-list/purchaseRoutes');
const purchaseBudgetRoutes = require('./routes/shopping-list/purchaseBudgetRoutes');
const purchaseSpendingRoutes = require('./routes/shopping-list/purchaseSpendingRoutes');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchase-budget', purchaseBudgetRoutes);
app.use('/api/purchase-spending', purchaseSpendingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 8070;

// Create server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
        server.listen(PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});
