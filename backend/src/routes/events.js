const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');

// GET /api/events - List all event types
router.get('/', EventController.getAllEvents);

// POST /api/events - Create a new event type
router.post('/', EventController.createEvent);

// PUT /api/events/:id - Update an existing event type
router.put('/:id', EventController.updateEvent);

// DELETE /api/events/:id - Delete an event type
router.delete('/:id', EventController.deleteEvent);

module.exports = router;
