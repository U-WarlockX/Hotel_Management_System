const express = require("express");
const app = express();
const staffRoutes = require("./routes/Uvindu_routes/staffRoutes");

// Middleware
app.use(express.json());

// Routes
app.use("/api", staffRoutes);

module.exports = app;
