const Staff = require("../../models/Uvindu_models/StaffModel");

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find(); // Get all staff data
    res.status(200).json(staff); // Respond with the staff data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff", error: err.message });
  }
};

// Add new staff
exports.addStaff = async (req, res) => {
  const { firstName, lastName, email, phone, jobTitle, department, shifts } = req.body;

  if (!firstName || !lastName || !email || !phone || !jobTitle || !department || !shifts) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newStaff = new Staff({
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    department,
    shifts,
    status: "Active",
  });

  try {
    const savedStaff = await newStaff.save();
    res.status(201).json({
      message: "Staff added successfully",
      staff: savedStaff,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding staff", error: err.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendanceData = req.body; // { staffId1: true, staffId2: false, ... }
    for (let id in attendanceData) {
      await Staff.findByIdAndUpdate(id, { status: attendanceData[id] ? "Active" : "Inactive" });
    }
    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating attendance", error: err.message });
  }
};

// Get active staff count
exports.getActiveStaffCount = async (req, res) => {
  try {
    const count = await Staff.countDocuments({ status: "Active" });
    res.status(200).json({ activeStaff: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching active staff count", error: err.message });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findByIdAndDelete(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
