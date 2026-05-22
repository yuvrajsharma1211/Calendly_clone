const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// GET /api/bookings/slots/:slug - Get dynamically generated available time slots
router.get('/slots/:slug', BookingController.getAvailableSlots);

// POST /api/bookings - Schedule a new meeting
router.post('/', BookingController.createBooking);

module.exports = router;
