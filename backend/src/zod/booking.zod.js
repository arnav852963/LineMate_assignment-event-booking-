import { z } from 'zod';

export const createBookingSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  seats: z
    .array(z.string())
    .min(1, 'At least one seat must be selected')
    .max(5, 'Cannot book more than 5 seats at once'),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
});

export const bookingResponseSchema = z.object({
  _id: z.any(),
  user: z.any().optional(),
  event: z.any().optional(),
  seats: z.array(z.string()),
  status: z.enum(['CONFIRMED', 'CANCELLED']),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});
