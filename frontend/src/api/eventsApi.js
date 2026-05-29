import axiosInstance from './axiosConfig';

export const eventsApi = {
  // Get all event types
  async getAll(){
    const response = await axiosInstance.get('/events');
    return response.data;
  },

  // Create new event type
  async create(eventData){
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  },

  // Update event type
  async update(id, eventData){
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event type
  async delete(id){
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  }
};
