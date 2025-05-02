const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

//middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS for frontend

// Routes
const itemRoutes = require('./routes/itemRoutes');
const inventoryRoutes = require('./routes/inventory-routes');
// app.use('/', itemRoutes);
app.use('/api/inventory', inventoryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected.'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//breadcrumb
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
});
const Product = mongoose.model('Product', ProductSchema);

app.get('/api/breadcrumb/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  res.json({
    path: [
      { name: 'Home', url: '/' },
      { name: product.category, url: '/products' },
      { name: product.name, url: `/products/${product._id}` },
    ],
  });
});

