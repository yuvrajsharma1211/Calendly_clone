const db = require('../config/db');

const EventModel = {
  // Get all event types
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM event_types ORDER BY created_at DESC');
    return rows;
  },

  // Get single event type by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM event_types WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Get single event type by slug
  getBySlug: async (slug) => {
    const [rows] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  // Create new event type
  create: async (eventData) => {
    const { title, slug, description, duration } = eventData;
    const [result] = await db.query(
      'INSERT INTO event_types (title, slug, description, duration) VALUES (?, ?, ?, ?)',
      [title, slug, description, duration]
    );
    return { id: result.insertId, ...eventData };
  },

  // Update existing event type
  update: async (id, eventData) => {
    const { title, slug, description, duration } = eventData;
    await db.query(
      'UPDATE event_types SET title = ?, slug = ?, description = ?, duration = ? WHERE id = ?',
      [title, slug, description, duration, id]
    );
    return { id, ...eventData };
  },

  // Delete event type
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM event_types WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = EventModel;
