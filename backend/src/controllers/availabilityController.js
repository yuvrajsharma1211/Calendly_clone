const AvailabilityModel = require('../models/availabilityModel');

const AvailabilityController = {
  // GET /api/availability
  async getAvailability(req, res) {
    try {
      const availability = await AvailabilityModel.getAll();
      return res.status(200).json({ success: true, data: availability });
    } catch (error) {
      console.error('Error fetching availability:', error);
      return res.status(500).json({ success: false, message: 'Server error fetching availability.' });
    }
  },

  // PUT /api/availability
  // Expects body format:
  // [
  //   { day_of_week: 'Monday', start_time: '09:00:00', end_time: '17:00:00', timezone: 'America/New_York', active: true },
  //   { day_of_week: 'Tuesday', start_time: '09:00:00', end_time: '17:00:00', timezone: 'America/New_York', active: false }
  // ]
  async updateAvailability(req, res){
    try {
      const schedule = req.body;

      if (!Array.isArray(schedule)) {
        return res.status(400).json({ success: false, message: 'Invalid schedule format. Must be an array.' });
      }

      // We process each day from the schedule in parallel or sequentially.
      for (const daySchedule of schedule) {
        const { day_of_week, start_time, end_time, timezone, active } = daySchedule;

        if (!day_of_week) {
          continue;
        }

        if (active === false) {
          // If deactivated, delete from database
          await AvailabilityModel.deleteDay(day_of_week);
        } else {
          // Otherwise, save or update the active availability
          const start = start_time || '09:00:00';
          const end = end_time || '17:00:00';
          const zone = timezone || 'America/New_York';
          await AvailabilityModel.updateDaily(day_of_week, start, end, zone);
        }
      }

      // Fetch the updated schedule to return it
      const updatedAvailability = await AvailabilityModel.getAll();
      return res.status(200).json({
        success: true,
        data: updatedAvailability,
        message: 'Weekly availability updated successfully!'
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      return res.status(500).json({ success: false, message: 'Server error updating availability.' });
    }
  }
};

module.exports = AvailabilityController;
