const db = require('../config/db');

const EventModel = {
  async getAll(){
    const [rows] = await db.query('SELECT * FROM event_types ORDER BY created_at DESC');
    return rows;
  },

  
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM event_types WHERE id = ?', [id]);
    return rows[0] || null;
  },

  
  async getBySlug(slug) {
    const [rows] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  
  async create(eventData) {
    const { title, slug, description, duration } = eventData;
    const [result] = await db.query(
      'INSERT INTO event_types (title, slug, description, duration) VALUES (?, ?, ?, ?)',
      [title, slug, description, duration]
    );
    return { id: result.insertId, ...eventData };
  },

  
  async update(id, eventData) {
    const { title, slug, description, duration } = eventData;
    await db.query(
      'UPDATE event_types SET title = ?, slug = ?, description = ?, duration = ? WHERE id = ?',
      [title, slug, description, duration, id]
    );
    return { id, ...eventData };
  },

  
  async delete(id) {
    const [result] = await db.query('DELETE FROM event_types WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = EventModel;
