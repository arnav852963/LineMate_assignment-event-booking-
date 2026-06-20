import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookie from 'cookie-parser';
import { auditLogMiddleware } from './middlewares/audit.middleware.js';

import { createServer } from 'http';
import { Server } from 'socket.io';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' });
}

const app = express();

const httpserver = createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN;
const io = new Server(httpserver, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookie());
app.use(auditLogMiddleware);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'welcome to linemate assignment',
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
});

import authRoutes from './routes/auth.routes.js';
app.use('/api/v1/auth', authRoutes);
import userRoutes from './routes/user.routes.js';
app.use('/api/v1/user', userRoutes);
import eventRoutes from "./routes/event.routes.js";
app.use("/api/v1/event", eventRoutes);

import bookingRoutes from "./routes/booking.routes.js";
app.use("/api/v1/booking", bookingRoutes);

export { httpserver, app, io };
