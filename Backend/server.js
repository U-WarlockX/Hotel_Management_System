const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const staffRoutes = require("./routes/Uvindu_routes/staffRoutes");
const authRoutes = require("./routes/Uvindu_routes/LoginRoutes");
const paymentRoutes = require("./routes/Dineth_routes/paymentRoutes");

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Routes
app.use("/api", staffRoutes); 
app.use("/api/auth", authRoutes); // Ensure correct routing
app.use("/api/payment", paymentRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
