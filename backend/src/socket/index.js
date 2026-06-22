import { Event } from '../models/event.model.js';
import { startSeatUnlockCron } from './cron.js';

export const initializeSocketHandlers = (io) => {
  const socketLocks = new Map();

  io.on('connection', (socket) => {
    socketLocks.set(socket.id, []);

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
                Date.now() + 2 * 60 * 1000
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
          const locks = socketLocks.get(socket.id) || [];
          locks.push({ eventId, seatId, userId });
          socketLocks.set(socket.id, locks);
        }
      } catch (error) {
      }
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
          io.to(eventId).emit('seatUnlocked', { seatId });
          let locks = socketLocks.get(socket.id) || [];
          locks = locks.filter((l) => l.seatId !== seatId);
          socketLocks.set(socket.id, locks);
        }
      } catch (error) {
      }
    });

    socket.on('disconnect', async () => {
      const locks = socketLocks.get(socket.id) || [];
      for (const lock of locks) {
        try {
          const updatedEvent = await Event.findOneAndUpdate(
            {
              _id: lock.eventId,
              seatLayout: {
                $elemMatch: {
                  seatId: lock.seatId,
                  status: 'LOCKED',
                  lockedBy: lock.userId,
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
              arrayFilters: [{ 'elem.seatId': lock.seatId }],
              new: true,
            }
          );

          if (updatedEvent) {
            io.to(lock.eventId).emit('seatUnlocked', { seatId: lock.seatId });
          }
        } catch (error) {
        }
      }
      socketLocks.delete(socket.id);
    });
  });

  startSeatUnlockCron(io);
};
