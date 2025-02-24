const Guest = require('../../models/Uvindu_mod/Guest');

// Create a new guest
exports.createGuest = async (req, res) => {
    try {
        const newGuest = new Guest(req.body);
        await newGuest.save();
        res.status(201).json(newGuest);
    } catch (err) {
        res.status(500).json({ message: 'Error creating guest' });
    }
};

// Get all guests
exports.getGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json(guests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching guests' });
    }
};

// Update guest details
exports.updateGuest = async (req, res) => {
    try {
        const updatedGuest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedGuest);
    } catch (err) {
        res.status(500).json({ message: 'Error updating guest' });
    }
};

// Delete guest
exports.deleteGuest = async (req, res) => {
    try {
        await Guest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Guest deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting guest' });
    }
};
