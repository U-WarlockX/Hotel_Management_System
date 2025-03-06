const express = require("express");
const router = express.Router();
const staffController = require("../../controllers/Uvindu_controllers/staffController"); // Ensure the path is correct

// GET all staff
router.get("/staff", staffController.getAllStaff);  // Note the relative URL

// POST new staff
router.post("/staff", staffController.addStaff);    // Note the relative URL

// POST attendance update
router.post("/staff/attendance", staffController.updateAttendance);

// GET active staff count
router.get("/staff/active-count", staffController.getActiveStaffCount);

// Route to delete staff
router.delete("/staff/:id", staffController.deleteStaff);

module.exports = router;
