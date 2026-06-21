import { api } from './api.js';

export const bookingApi = {
  createBooking: (data) => {
    return api.post('/booking/createBooking', data);
  },

  getMyBookings: () => {
    return api.get('/booking/getMyBookings');
  },

  cancelBooking: (data) => {
    return api.post('/booking/cancelBooking', data);
  },
};
