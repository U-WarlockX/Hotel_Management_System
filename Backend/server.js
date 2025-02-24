require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
