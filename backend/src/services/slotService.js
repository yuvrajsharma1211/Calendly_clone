const AvailabilityModel = require('../models/availabilityModel');
const MeetingModel = require('../models/meetingModel');

/**
 * Service to handle dynamic time-slot generation and filtering.
 */
const SlotService = {
  /**
   * Generates available time slots for a specific event type on a specific date.
   * @param {Object} eventType - The event type object (contains duration)
   * @param {string} dateString - Format YYYY-MM-DD
   * @returns {Promise<Array>} List of available slots { start_time, end_time }
   */
  generateAvailableSlots: async (eventType, dateString) => {
    // 1. Determine day of the week for the requested date
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    // Days of week array to match database ENUM
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];

    // 2. Fetch all availability rules
    const allAvailabilities = await AvailabilityModel.getAll();
    const dayAvailability = allAvailabilities.find(a => a.day_of_week === dayOfWeek);

    // If no availability set for this day, return empty slots
    if (!dayAvailability) {
      return [];
    }

    const { start_time, end_time } = dayAvailability;
    const duration = eventType.duration; // in minutes

    // 3. Generate all theoretical slots based on day's working hours and event duration
    const slots = [];
    
    // Parse time strings ("HH:MM:SS") into minutes from start of day
    const timeToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const minutesToTime = (totalMinutes) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    };

    const startMinutes = timeToMinutes(start_time);
    const endMinutes = timeToMinutes(end_time);

    let currentSlotStart = startMinutes;
    while (currentSlotStart + duration <= endMinutes) {
      const currentSlotEnd = currentSlotStart + duration;
      slots.push({
        start_time: minutesToTime(currentSlotStart),
        end_time: minutesToTime(currentSlotEnd)
      });
      currentSlotStart += duration; // increment by duration
    }

    // 4. Retrieve existing meetings for this date to exclude booked slots
    const bookedMeetings = await MeetingModel.getBookedSlotsByDate(dateString);

    // Helper to check if two time ranges overlap
    // Range A: [startA, endA], Range B: [startB, endB]
    const isOverlapping = (startA, endA, startB, endB) => {
      const aStart = timeToMinutes(startA);
      const aEnd = timeToMinutes(endA);
      const bStart = timeToMinutes(startB);
      const bEnd = timeToMinutes(endB);

      return (aStart < bEnd && bStart < aEnd);
    };

    // 5. Filter out slots that overlap with already booked meetings
    let availableSlots = slots.filter(slot => {
      const isBooked = bookedMeetings.some(booking => 
        isOverlapping(slot.start_time, slot.end_time, booking.start_time, booking.end_time)
      );
      return !isBooked;
    });

    // 6. Special case: If the date is TODAY, filter out past time slots
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateString === todayStr) {
      const now = new Date();
      // Adjust to Eastern Time (or matching the user's timezone)
      // For simplicity in a standard interview clone, let's filter relative to system current time.
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      availableSlots = availableSlots.filter(slot => {
        const slotStartMinutes = timeToMinutes(slot.start_time);
        return slotStartMinutes > currentMinutes;
      });
    }

    return availableSlots;
  }
};

module.exports = SlotService;
