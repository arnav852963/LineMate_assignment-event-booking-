import { Router } from 'express';
import { getAllEvents, getEventById } from '../controllers/event.controller.js';

const eventRoutes = Router();

eventRoutes.route('/getAllEvents').get(getAllEvents);
eventRoutes.route('/getEventById/:eventId').get(getEventById);

export default eventRoutes;
