const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer"); // Import multer
const staffRoutes = require("./routes/Uvindu_routes/staffRoutes"); // Check the relative path

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve files from the 'uploads' directory

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post("/api/upload", upload.single("profilePic"), (req, res) => {
  if (req.file) {
    // Send the uploaded file URL in the response
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
});

// Routes
app.use("/api", staffRoutes); // Prefix routes with '/api'

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
