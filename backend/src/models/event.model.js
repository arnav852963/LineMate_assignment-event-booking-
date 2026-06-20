import mongoose, { Schema } from 'mongoose';

const seatSchema = new Schema({
  seatId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
    default: 'AVAILABLE',
  },
  lockedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  lockExpiresAt: {
    type: Date,
    default: null,
  },
});

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    seatLayout: [seatSchema],
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
