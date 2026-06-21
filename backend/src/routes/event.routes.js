import { Router } from 'express';
import { getAllEvents, getEventById } from '../controllers/event.controller.js';
import { jwt_auth } from '../middlewares/jwt_auth.middleware.js';

const eventRoutes = Router();

eventRoutes.route('/getAllEvents').get(getAllEvents);
eventRoutes.route('/getEventById/:eventId').get(jwt_auth, getEventById);

export default eventRoutes;
