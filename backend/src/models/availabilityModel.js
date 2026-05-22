const db = require('../config/db');

const AvailabilityModel = {
  // Get all availability records
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM availability');
    return rows;
  },

  // Save/Update weekly availability
  // Handles saving day-by-day availability schedules.
  updateDaily: async (day_of_week, start_time, end_time, timezone) => {
    // Insert or update on duplicate key (day_of_week is a unique key)
    const [result] = await db.query(
      `INSERT INTO availability (day_of_week, start_time, end_time, timezone) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE start_time = ?, end_time = ?, timezone = ?`,
      [day_of_week, start_time, end_time, timezone, start_time, end_time, timezone]
    );
    return result;
  },

  // Reset/Delete a day's availability (in case user wants to make a day unavailable)
  deleteDay: async (day_of_week) => {
    const [result] = await db.query('DELETE FROM availability WHERE day_of_week = ?', [day_of_week]);
    return result.affectedRows > 0;
  }
};

module.exports = AvailabilityModel;
