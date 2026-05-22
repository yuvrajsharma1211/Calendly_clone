const express = require('express');
const router = express.Router();
const AvailabilityController = require('../controllers/availabilityController');

// GET /api/availability - Get weekly availability
router.get('/', AvailabilityController.getAvailability);

// PUT /api/availability - Update weekly availability
router.put('/', AvailabilityController.updateAvailability);

module.exports = router;
