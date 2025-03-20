const Room = require("../../models/Bawantha_models/Room");

// ✅ Create a New Room
exports.createRoom = async (req, res) => {
  try {
    console.log("✅ createRoom function triggered");
    console.log("📥 Received Data:", req.body); // Debug request data

    let room;
    if (Array.isArray(req.body)) {
      room = await Room.insertMany(req.body);
    } else {
      room = await Room.create(req.body);
    }

    console.log("✅ Room Created Successfully:", room);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    console.error("❌ Error creating room:", error); // Log errors
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Fetch All Rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms from MongoDB
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Fetch a Single Room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error("❌ Error fetching room by ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Fetch Specific Room Fields (Room Number, Type, Price, and Images)
exports.getRoomSummary = async (req, res) => {
  try {
    const rooms = await Room.find({}, "roomNumber roomType price images"); // Select only required fields

    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.error("❌ Error fetching room summary:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.markRoomAsBooked = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomNumber: req.params.roomNumber },
      { availability: false }, // ✅ Mark room as unavailable
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error("❌ Error marking room as booked:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.markRoomAsAvailable = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomNumber: req.params.roomNumber },
      { availability: true }, // ✅ Mark room as available again
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.error("❌ Error marking room as available:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Fetch Only Available Rooms
exports.getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: true }); // Fetch rooms where availability is true
    res.status(200).json({ success: true, data: availableRooms });
  } catch (error) {
    console.error("❌ Error fetching available rooms:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
