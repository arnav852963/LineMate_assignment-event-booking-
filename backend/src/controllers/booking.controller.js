import { Booking } from '../models/booking.model.js';
import { Event } from '../models/event.model.js';
import { asyncHandler } from '../utilities/asyncHandler.js';
import { ApiError } from '../utilities/ApiError.js';
import { ApiResponse } from '../utilities/ApiResponse.js';
import {
  createBookingSchema,
  cancelBookingSchema,
  bookingResponseSchema,
} from '../zod/booking.zod.js';

const createBooking = asyncHandler(async (req, res) => {
  const parsedBody = createBookingSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(
      400,
      parsedBody.error?.errors?.[0]?.message || 'Invalid booking data provided'
    );
  }

  const { eventId, seats } = parsedBody.data;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  if (event.availableSeats < seats.length) {
    throw new ApiError(400, 'Not enough seats available');
  }

  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      seatLayout: {
        $not: {
          $elemMatch: {
            seatId: { $in: seats },
            $or: [
              { status: 'BOOKED' },
              { status: 'LOCKED', lockedBy: { $ne: userId } },
            ],
          },
        },
      },
    },
    {
      $set: {
        'seatLayout.$[elem].status': 'BOOKED',
        'seatLayout.$[elem].lockedBy': userId,
      },
      $inc: { availableSeats: -seats.length },
    },
    {
      arrayFilters: [{ 'elem.seatId': { $in: seats } }],
      new: true,
    }
  );

  if (!updatedEvent) {
    throw new ApiError(
      409,
      'Double booking detected! One or more of these seats were just taken. Please try again.'
    );
  }

  const booking = await Booking.create({
    user: userId,
    event: eventId,
    seats: seats,
    status: 'CONFIRMED',
  });

  req.io.to(eventId).emit('seatsBooked', { seats });

  const validatedBooking = bookingResponseSchema.parse(booking);

  return res
    .status(201)
    .json(
      new ApiResponse(201, validatedBooking, 'Booking confirmed successfully')
    );
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event', 'name venue dateTime image')
    .sort({ createdAt: -1 })
    .lean();

  if (!bookings) {
    throw new ApiError(500, 'Failed to fetch bookings');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'Bookings fetched successfully'));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const parsedBody = cancelBookingSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(
      400,
      parsedBody.error?.errors?.[0]?.message ||
        'Invalid cancellation data provided'
    );
  }

  const { bookingId, seatsToCancel } = parsedBody.data;

  const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.status === 'CANCELLED') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  let finalSeatsToCancel = booking.seats;

  if (seatsToCancel && seatsToCancel.length > 0) {
    const allBelong = seatsToCancel.every((seat) =>
      booking.seats.includes(seat)
    );
    if (!allBelong) {
      throw new ApiError(
        400,
        'Some selected seats do not belong to this booking'
      );
    }
    finalSeatsToCancel = seatsToCancel;
  }

  const remainingSeats = booking.seats.filter(
    (seat) => !finalSeatsToCancel.includes(seat)
  );

  if (remainingSeats.length === 0) {
    booking.status = 'CANCELLED';
    booking.seats = [];
  } else {
    booking.seats = remainingSeats;
  }

  await booking.save();

  await Event.updateOne(
    { _id: booking.event },
    {
      $set: {
        'seatLayout.$[elem].status': 'AVAILABLE',
        'seatLayout.$[elem].lockedBy': null,
      },
      $inc: { availableSeats: finalSeatsToCancel.length },
    },
    {
      arrayFilters: [{ 'elem.seatId': { $in: finalSeatsToCancel } }],
    }
  );

  req.io
    .to(booking.event.toString())
    .emit('seatsUnlocked', { seats: finalSeatsToCancel });

  const validatedBooking = bookingResponseSchema.parse(booking);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        validatedBooking,
        'Booking updated successfully. Seats have been released.'
      )
    );
});

export { createBooking, getMyBookings, cancelBooking };
