import { Event } from '../models/event.model.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { ApiError } from '../utilities/ApiError.js';
import { ApiResponse } from '../utilities/ApiResponse.js';
import { eventResponseSchema } from '../zod/event.zod.js';

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).select('-seatLayout').lean();

  if (!events) {
    throw new ApiError(500, 'Error fetching events');
  }

  const validatedEvents = events.map((event) =>
    eventResponseSchema.parse(event)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, validatedEvents, 'Events fetched successfully'));
});

const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, 'Event ID is required');
  }

  const event = await Event.findById(eventId).lean();

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const validatedEvent = eventResponseSchema.parse(event);

  return res
    .status(200)
    .json(
      new ApiResponse(200, validatedEvent, 'Event details fetched successfully')
    );
});

export { getAllEvents, getEventById };
