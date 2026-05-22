const db = require('../config/db');

const MeetingModel = {
  // Get all meetings
  getAll: async () => {
    const query = `
      SELECT m.*, e.title AS event_title, e.duration AS event_duration 
      FROM meetings m
      JOIN event_types e ON m.event_type_id = e.id
      ORDER BY m.meeting_date ASC, m.start_time ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Get upcoming meetings (scheduled & today onwards)
  getUpcoming: async () => {
    const query = `
      SELECT m.*, e.title AS event_title, e.duration AS event_duration 
      FROM meetings m
      JOIN event_types e ON m.event_type_id = e.id
      WHERE m.status = 'scheduled' AND (m.meeting_date > CURDATE() OR (m.meeting_date = CURDATE() AND m.start_time >= CURTIME()))
      ORDER BY m.meeting_date ASC, m.start_time ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Get past meetings or cancelled meetings
  getPast: async () => {
    const query = `
      SELECT m.*, e.title AS event_title, e.duration AS event_duration 
      FROM meetings m
      JOIN event_types e ON m.event_type_id = e.id
      WHERE m.status = 'cancelled' OR m.meeting_date < CURDATE() OR (m.meeting_date = CURDATE() AND m.start_time < CURTIME())
      ORDER BY m.meeting_date DESC, m.start_time DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Check if a time slot is already booked for that date to prevent double bookings
  checkConflict: async (meeting_date, start_time, end_time) => {
    const query = `
      SELECT * FROM meetings 
      WHERE meeting_date = ? 
      AND status = 'scheduled'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (? <= start_time AND ? > start_time)
      )
    `;
    const [rows] = await db.query(query, [
      meeting_date, 
      start_time, start_time,
      end_time, end_time,
      start_time, end_time
    ]);
    return rows.length > 0;
  },

  // Find all booked meetings on a given date to exclude them from dynamic slot generation
  getBookedSlotsByDate: async (meeting_date) => {
    const query = `
      SELECT start_time, end_time FROM meetings 
      WHERE meeting_date = ? AND status = 'scheduled'
    `;
    const [rows] = await db.query(query, [meeting_date]);
    return rows;
  },

  // Create booking
  create: async (meetingData) => {
    const { event_type_id, invitee_name, invitee_email, meeting_date, start_time, end_time } = meetingData;
    const [result] = await db.query(
      `INSERT INTO meetings (event_type_id, invitee_name, invitee_email, meeting_date, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
      [event_type_id, invitee_name, invitee_email, meeting_date, start_time, end_time]
    );
    return { id: result.insertId, ...meetingData, status: 'scheduled' };
  },

  // Cancel meeting
  cancel: async (id) => {
    const [result] = await db.query(
      `UPDATE meetings SET status = 'cancelled' WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = MeetingModel;
