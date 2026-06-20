import { z } from 'zod';

export const userResponseSchema = z.object({
  _id: z.any(),
  fullName: z.string(),
  email: z.string().email(),
  profilePhoto: z.string().optional().nullable(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});
