import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { jwt_auth } from '../middlewares/jwt_auth.middleware.js';

const bookingRoutes = Router();

bookingRoutes.use(jwt_auth);

bookingRoutes.route('/createBooking').post(createBooking);
bookingRoutes.route('/getMyBookings').get(getMyBookings);
bookingRoutes.route('/cancelBooking').post(cancelBooking);

export default bookingRoutes;
