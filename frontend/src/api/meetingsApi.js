import axiosInstance from './axiosConfig';

export const meetingsApi = {
  // Get all meetings (partitioned upcoming and past)
  getAll: async () => {
    const response = await axiosInstance.get('/meetings');
    return response.data;
  },

  // Cancel a meeting by ID
  cancel: async (id) => {
    const response = await axiosInstance.put(`/meetings/${id}/cancel`);
    return response.data;
  }
};
