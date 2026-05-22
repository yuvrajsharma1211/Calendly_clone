import axiosInstance from './axiosConfig';

export const availabilityApi = {
  // Get weekly availability
  get: async () => {
    const response = await axiosInstance.get('/availability');
    return response.data;
  },

  // Update weekly availability
  update: async (schedule) => {
    const response = await axiosInstance.put('/availability', schedule);
    return response.data;
  }
};
