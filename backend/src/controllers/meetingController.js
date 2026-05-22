const MeetingModel = require('../models/meetingModel');

const MeetingController = {
  // GET /api/meetings
  getMeetings: async (req, res) => {
    try {
      const upcoming = await MeetingModel.getUpcoming();
      const past = await MeetingModel.getPast();
      
      return res.status(200).json({
        success: true,
        data: {
          upcoming,
          past
        }
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return res.status(500).json({ success: false, message: 'Server error fetching meetings.' });
    }
  },

  // PUT /api/meetings/:id/cancel
  cancelMeeting: async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await MeetingModel.cancel(id);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Meeting not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Meeting cancelled successfully!'
      });
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      return res.status(500).json({ success: false, message: 'Server error cancelling meeting.' });
    }
  }
};

module.exports = MeetingController;
