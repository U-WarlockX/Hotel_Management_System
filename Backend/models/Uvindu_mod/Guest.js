const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    fullName: String,
    dateOfBirth: Date,
    email: String,
    phone: String,
    idNumber: String,
    nationality: String,
    roomPreferences: {
        smoking: Boolean,
        bedType: { type: String, enum: ['Single', 'Double'] },
        specialRequests: String
    },
    paymentDetails: {
        cardNumber: String,
        expiryDate: Date,
        cvv: String
    },
    status: { type: String, enum: ['Checked-In', 'Checked-Out'], default: 'Checked-In' },
    checkInDate: Date,
    checkOutDate: Date
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
