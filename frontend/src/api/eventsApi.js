import axiosInstance from './axiosConfig';

export const eventsApi = {
  // Get all event types
  getAll: async () => {
    const response = await axiosInstance.get('/events');
    return response.data;
  },

  // Create new event type
  create: async (eventData) => {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  },

  // Update event type
  update: async (id, eventData) => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event type
  delete: async (id) => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  }
};
