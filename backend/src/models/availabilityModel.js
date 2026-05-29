const db = require('../config/db');

const AvailabilityModel = {
  
  async getAll(){
    const [rows] = await db.query('SELECT * FROM availability');
    return rows;
  },

  
  async updateDaily(day_of_week, start_time, end_time, timezone) {
    
    const [result] = await db.query(
      `INSERT INTO availability 
      (day_of_week, start_time, end_time, timezone) 
      VALUES (?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE 
      start_time = ?, end_time = ?, timezone = ?`,
      [day_of_week, start_time, end_time, timezone, start_time, end_time, timezone]
    );
    return result;
  },


  async deleteDay(day_of_week) {
    const [result] = await db.query('DELETE FROM availability WHERE day_of_week = ?', [day_of_week]);
    return result.affectedRows > 0;
  }
};

module.exports = AvailabilityModel;
