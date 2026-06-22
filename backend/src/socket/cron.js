import { Event } from '../models/event.model.js';

export const startSeatUnlockCron = (io) => {
  let isRunning = false;

  setInterval(async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const now = new Date();
      const events = await Event.find({
        seatLayout: {
          $elemMatch: { status: 'LOCKED', lockExpiresAt: { $lte: now } },
        },
      });

      for (const event of events) {
        const expiredSeats = event.seatLayout
          .filter((s) => s.status === 'LOCKED' && s.lockExpiresAt && s.lockExpiresAt <= now)
          .map((s) => s.seatId);

        if (expiredSeats.length > 0) {
          await Event.updateOne(
            { _id: event._id },
            {
              $set: {
                'seatLayout.$[elem].status': 'AVAILABLE',
                'seatLayout.$[elem].lockedBy': null,
                'seatLayout.$[elem].lockExpiresAt': null,
              },
            },
            {
              arrayFilters: [{ 'elem.seatId': { $in: expiredSeats }, 'elem.status': 'LOCKED' }],
            }
          );

          expiredSeats.forEach((seatId) => {
            io.to(event._id.toString()).emit('seatUnlocked', { seatId });
          });
        }
      }
    } catch (error) {
      console.error('Seat Unlock Cron Error:', error);
    } finally {
      isRunning = false;
    }
  }, 15000);
};
