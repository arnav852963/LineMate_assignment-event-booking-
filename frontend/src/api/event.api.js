import { api } from './api.js';

export const eventApi = {
  getAllEvents: () => {
    return api.get('/event/getAllEvents');
  },

  getEventById: (eventId) => {
    return api.get(`/event/getEventById/${eventId}`);
  },
};
