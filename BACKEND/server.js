const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for frontend

// Routes
const itemRoutes = require('./routes/itemRoutes');
app.use('/', itemRoutes);
// Routes
app.use('/api/auth', require('./routes/user-managemnt/suppliers'));
app.use('/api/auth', require('./routes/user-managemnt/auth'));
app.use('/api/waste', require('./routes/user-managemnt/waste'));

app.use("/api/purchases", require("./routes/shopping-list/purchaseRoutes")); // Corrected path
app.use("/api/purchase-budget", require("./routes/shopping-list/purchaseBudgetRoutes")); // Corrected path
app.use("/api/purchase-spending", require("./routes/shopping-list/purchaseSpendingRoutes")); // Corrected path
app.use("/api/shopping-list", require("./routes/shopping-list/shoppingListRoutes")); // Corrected path

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Menda...'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
