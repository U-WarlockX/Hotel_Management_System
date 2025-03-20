const express = require("express");
const cors = require("cors"); 
const roomRoutes = require("./routes/Bawantha_routes/roomRoutes"); // ✅ Ensure path is correct
const bookingRoutes = require("./routes/Bawantha_routes/bookingRoutes");
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Debugging Log
console.log("✅ App.js Loaded");

// ✅ Define API Routes
app.use("/api/rooms", roomRoutes);  // ✅ This must exist
app.use("/api/bookings", bookingRoutes);


// ✅ Default Route for Testing
app.get("/", (req, res) => {
  res.send("Hotel Booking API is Running!");
});

module.exports = app;
