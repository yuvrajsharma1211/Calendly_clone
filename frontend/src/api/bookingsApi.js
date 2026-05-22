import axiosInstance from './axiosConfig';

export const bookingsApi = {
  // Get available slots for a slug and date
  getSlots: async (slug, date) => {
    const response = await axiosInstance.get(`/bookings/slots/${slug}`, {
      params: { date }
    });
    return response.data;
  },

  // Create a booking
  create: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  }
};
