const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const staffController = require("../../controllers/Uvindu_controllers/staffController");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// GET all staff
router.get("/staff", staffController.getAllStaff);

// POST new staff (Now includes file upload)
router.post("/staff", upload.single("profilePic"), staffController.addStaff);

// PUT update profile picture
router.put("/staff/:id/profilePic", upload.single("profilePic"), staffController.updateProfilePicture);

// POST update attendance
router.post("/staff/attendance", staffController.updateAttendance);

// GET active staff count
router.get("/staff/active-count", staffController.getActiveStaffCount);

// DELETE staff member
router.delete("/staff/:id", staffController.deleteStaff);

module.exports = router;
