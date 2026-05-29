import axiosInstance from './axiosConfig';

export const availabilityApi = {
  // Get weekly availability
  async  get(){
    const response = await axiosInstance.get('/availability');
    return response.data;
  },

  // Update weekly availability
  async update(schedule){
    const response = await axiosInstance.put('/availability', schedule);
    return response.data;
  }
};
