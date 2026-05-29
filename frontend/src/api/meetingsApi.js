import axiosInstance from './axiosConfig';

export const meetingsApi = {
  
  async getAll(){
    const response = await axiosInstance.get('/meetings');
    return response.data;
  },

  async cancel(id){
    const response = await axiosInstance.put(`/meetings/${id}/cancel`);
    return response.data;
  }
};
