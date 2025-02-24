// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Initialize dotenv to load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware setup (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Example route
app.get('/', (req, res) => {
  res.send('Hello, Hotel Management System!');
});

// Example of another route
app.get('/api', (req, res) => {
  res.json({
    message: 'This is your API!',
  });
});

// Set up the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
