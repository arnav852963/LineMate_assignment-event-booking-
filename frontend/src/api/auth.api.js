import { api } from './api.js';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/googleAuth', data),
  logout: () => api.post('/auth/logout'),
};
