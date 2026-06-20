import { Event } from '../models/event.model.js';

export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinEventRoom', (eventId) => {
      socket.join(eventId);
    });

    socket.on('leaveEventRoom', (eventId) => {
      socket.leave(eventId);
    });

    socket.on('lockSeat', async ({ eventId, seatId, userId }) => {
      try {
        const updatedEvent = await Event.findOneAndUpdate(
          {
            _id: eventId,
            seatLayout: { $elemMatch: { seatId: seatId, status: 'AVAILABLE' } },
          },
          {
            $set: {
              'seatLayout.$[elem].status': 'LOCKED',
              'seatLayout.$[elem].lockedBy': userId,
              'seatLayout.$[elem].lockExpiresAt': new Date(
                Date.now() + 5 * 60 * 1000
              ),
            },
          },
          {
            arrayFilters: [{ 'elem.seatId': seatId }],
            new: true,
          }
        );

        if (updatedEvent) {
          socket.to(eventId).emit('seatLocked', { seatId, lockedBy: userId });
        }
      } catch (error) {}
    });

    socket.on('unlockSeat', async ({ eventId, seatId, userId }) => {
      try {
        const updatedEvent = await Event.findOneAndUpdate(
          {
            _id: eventId,
            seatLayout: {
              $elemMatch: {
                seatId: seatId,
                status: 'LOCKED',
                lockedBy: userId,
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
          {
            arrayFilters: [{ 'elem.seatId': seatId }],
            new: true,
          }
        );

        if (updatedEvent) {
          socket.to(eventId).emit('seatUnlocked', { seatId });
        }
      } catch (error) {}
    });

    socket.on('disconnect', () => {});
  });
};
