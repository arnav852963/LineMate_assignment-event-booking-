import { z } from 'zod';

export const seatSchema = z.object({
  _id: z.any().optional(),
  seatId: z.string(),
  status: z.enum(['AVAILABLE', 'LOCKED', 'BOOKED']),
  lockedBy: z.any().optional().nullable(),
  lockExpiresAt: z.any().optional().nullable(),
});

export const eventResponseSchema = z.object({
  _id: z.any(),
  name: z.string(),
  description: z.string(),
  dateTime: z.any(),
  venue: z.string(),
  totalSeats: z.number(),
  image: z.string().optional(),
  availableSeats: z.number().int().min(0),
  pricing: z
    .object({
      tier1: z.number(),
      tier2: z.number(),
      tier3: z.number(),
    })
    .optional(),
  seatLayout: z.array(seatSchema).optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});
