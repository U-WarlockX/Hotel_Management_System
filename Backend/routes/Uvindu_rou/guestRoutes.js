const express = require('express');
const router = express.Router();
const guestController = require('../../controllers/Uvindu_con/guestController');

// Guest routes
router.post('/create', guestController.createGuest);
router.get('/', guestController.getGuests);
router.put('/update/:id', guestController.updateGuest);
router.delete('/delete/:id', guestController.deleteGuest);

module.exports = router;
