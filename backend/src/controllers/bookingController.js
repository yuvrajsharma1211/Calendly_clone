const EventModel = require('../models/eventModel');
const MeetingModel = require('../models/meetingModel');
const SlotService = require('../services/slotService');

const BookingController = {
  // GET /api/bookings/slots/:slug
  // Query param: date=YYYY-MM-DD
  getAvailableSlots: async (req, res) => {
    try {
      const { slug } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ success: false, message: 'Date query parameter is required (YYYY-MM-DD).' });
      }

      // Fetch event type details
      const eventType = await EventModel.getBySlug(slug);
      if (!eventType) {
        return res.status(404).json({ success: false, message: 'Event type not found.' });
      }

      // Generate slots using the Service
      const slots = await SlotService.generateAvailableSlots(eventType, date);

      return res.status(200).json({
        success: true,
        data: {
          event: eventType,
          date,
          slots
        }
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return res.status(500).json({ success: false, message: error.message || 'Server error fetching slots.' });
    }
  },

  // POST /api/bookings
  createBooking: async (req, res) => {
    try {
      const { event_type_id, invitee_name, invitee_email, meeting_date, start_time, end_time } = req.body;

      // Basic validation
      if (!event_type_id || !invitee_name || !invitee_email || !meeting_date || !start_time || !end_time) {
        return res.status(400).json({ success: false, message: 'All booking fields are required.' });
      }

      // 1. Verify Event Type exists
      const eventType = await EventModel.getById(event_type_id);
      if (!eventType) {
        return res.status(404).json({ success: false, message: 'Event type not found.' });
      }

      // 2. Prevent Double Booking
      const conflict = await MeetingModel.checkConflict(meeting_date, start_time, end_time);
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'This time slot has already been booked. Please choose another slot.'
        });
      }

      // 3. Create the Booking
      const booking = await MeetingModel.create({
        event_type_id,
        invitee_name,
        invitee_email,
        meeting_date,
        start_time,
        end_time
      });

      return res.status(201).json({
        success: true,
        data: {
          ...booking,
          event_title: eventType.title,
          event_duration: eventType.duration
        },
        message: 'Meeting scheduled successfully!'
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      return res.status(500).json({ success: false, message: 'Server error scheduling meeting.' });
    }
  }
};

module.exports = BookingController;
