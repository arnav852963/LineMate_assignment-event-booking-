import { api } from './api.js';

export const userApi = {
  getUser: () => {
    return api.get('/user/getUser');
  },

  addProfilePhoto: (formData) => {
    return api.post('/user/addProfilePhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  refreshUserToken: () => {
    return api.post('/user/refreshToken');
  },
};
