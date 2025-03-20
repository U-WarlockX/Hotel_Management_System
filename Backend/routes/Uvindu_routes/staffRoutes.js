const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const staffController = require("../../controllers/Uvindu_controllers/staffController");

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Set upload destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage });

// Routes for staff management

// GET all staff
router.get("/staff", staffController.getAllStaff);

// POST new staff (Now includes file upload for profile picture)
router.post("/staff", upload.single("profilePic"), staffController.addStaff);

// PUT update profile picture
router.put("/staff/:id/profilePic", upload.single("profilePic"), staffController.updateProfilePicture);

// POST update attendance (bulk update for attendance status)
router.post("/staff/attendance", staffController.updateAttendance);

// GET active staff count
router.get("/staff/active-count", staffController.getActiveStaffCount);

// DELETE staff member
router.delete("/staff/:id", staffController.deleteStaff);

// Generate and download Excel file containing staff data
router.get("/staff/export/excel", staffController.exportToExcel);

// Generate and download PDF file containing staff data
router.get("/staff/export/pdf", staffController.exportToPDF);

module.exports = router;
