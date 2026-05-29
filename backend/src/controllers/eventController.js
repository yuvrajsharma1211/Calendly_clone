const EventModel = require('../models/eventModel');

// Helper to convert title into URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

const EventController = {
  // GET /api/events
  async getAllEvents(req, res) {
    try {
      const events = await EventModel.getAll();
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      console.error('Error fetching event types:', error);
      return res.status(500).json({ success: false, message: 'Server error fetching event types.' });
    }
  },

  // POST /api/events
  async createEvent(req, res) {
    try {
      const { title, description, duration } = req.customBody || req.body;
      let { slug } = req.customBody || req.body;

      if (!title || !duration) {
        return res.status(400).json({ success: false, message: 'Title and duration are required.' });
      }

      // Generate slug if not provided or format it
      slug = slug ? slugify(slug) : slugify(title);

      // Check if slug is unique
      const existingEvent = await EventModel.getBySlug(slug);
      if (existingEvent) {
        // Append a unique suffix if slug conflicts
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const newEvent = await EventModel.create({
        title,
        slug,
        description: description || '',
        duration: parseInt(duration, 10)
      });

      return res.status(201).json({ success: true, data: newEvent, message: 'Event type created successfully!' });
    } catch (error) {
      console.error('Error creating event type:', error);
      return res.status(500).json({ success: false, message: 'Server error creating event type.' });
    }
  },

  // PUT /api/events/:id
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, duration } = req.body;
      let { slug } = req.body;

      if (!title || !duration) {
        return res.status(400).json({ success: false, message: 'Title and duration are required.' });
      }

      const existingEvent = await EventModel.getById(id);
      if (!existingEvent) {
        return res.status(404).json({ success: false, message: 'Event type not found.' });
      }

      // Generate slug or format it
      slug = slug ? slugify(slug) : slugify(title);

      // Check for slug uniqueness, ignoring current event id
      const slugConflictingEvent = await EventModel.getBySlug(slug);
      if (slugConflictingEvent && slugConflictingEvent.id !== parseInt(id, 10)) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const updatedEvent = await EventModel.update(id, {
        title,
        slug,
        description: description || '',
        duration: parseInt(duration, 10)
      });

      return res.status(200).json({ success: true, data: updatedEvent, message: 'Event type updated successfully!' });
    } catch (error) {
      console.error('Error updating event type:', error);
      return res.status(500).json({ success: false, message: 'Server error updating event type.' });
    }
  },

  // DELETE /api/events/:id
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const success = await EventModel.delete(id);

      if (!success) {
        return res.status(404).json({ success: false, message: 'Event type not found.' });
      }

      return res.status(200).json({ success: true, message: 'Event type deleted successfully!' });
    } catch (error) {
      console.error('Error deleting event type:', error);
      return res.status(500).json({ success: false, message: 'Server error deleting event type.' });
    }
  }
};

module.exports = EventController;
