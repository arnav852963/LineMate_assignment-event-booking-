import { z } from 'zod';

export const registerBodySchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleLoginBodySchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});

export const authResponseSchema = z.object({
  user: z.object({
    _id: z.any(),
    fullName: z.string(),
    email: z.string().email(),
    profilePhoto: z.string().optional().nullable(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});
