const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/meetingController');

// GET /api/meetings - Get all meetings (partitioned into upcoming and past)
router.get('/', MeetingController.getMeetings);

// PUT /api/meetings/:id/cancel - Cancel a meeting
router.put('/:id/cancel', MeetingController.cancelMeeting);

module.exports = router;
