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


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...siri'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 8070;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});