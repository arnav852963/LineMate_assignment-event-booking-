import { Event } from '../models/event.model.js';

export const startSeatUnlockCron = (io) => {
  setInterval(async () => {
    try {
      const now = new Date();
      const events = await Event.find({
        seatLayout: {
          $elemMatch: { status: 'LOCKED', lockExpiresAt: { $lte: now } },
        },
      });

      for (const event of events) {
        for (const seat of event.seatLayout) {
          if (
            seat.status === 'LOCKED' &&
            seat.lockExpiresAt &&
            seat.lockExpiresAt <= now
          ) {
            const updated = await Event.findOneAndUpdate(
              {
                _id: event._id,
                seatLayout: {
                  $elemMatch: {
                    seatId: seat.seatId,
                    status: 'LOCKED',
                    lockExpiresAt: { $lte: now },
                  },
                },
              },
              {
                $set: {
                  'seatLayout.$[elem].status': 'AVAILABLE',
                  'seatLayout.$[elem].lockedBy': null,
                  'seatLayout.$[elem].lockExpiresAt': null,
                },
              },
              { arrayFilters: [{ 'elem.seatId': seat.seatId }], new: true }
            );

            if (updated) {
              io.to(event._id.toString()).emit('seatUnlocked', {
                seatId: seat.seatId,
              });
            }
          }
        }
      }
    } catch (error) {}
  }, 60 * 1000);
};
