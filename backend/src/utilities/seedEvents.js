import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../models/event.model.js';

dotenv.config({ path: './.env' });

const seedEvents = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error(
        'MONGO_URI is missing. Please make sure your .env file is loaded correctly.'
      );
    }

    await mongoose.connect(process.env.MONGO_URL);
    await Event.deleteMany({});

    const generateLayout = () => {
      const layout = [];
      const rows = ['A', 'B', 'C', 'D', 'E'];
      for (let row of rows) {
        for (let i = 1; i <= 10; i++) {
          layout.push({
            seatId: `${row}${i}`,
            status: 'AVAILABLE',
            lockedBy: null,
            lockExpiresAt: null,
          });
        }
      }
      return layout;
    };

    const dummyEvents = [
      {
        name: 'Coldplay Music of the Spheres Tour',
        description:
          'Experience the magic of Coldplay live in an unforgettable, color-filled stadium concert.',
        dateTime: new Date('2026-10-15T19:00:00Z'),
        venue: 'Wembley Stadium, London',
        totalSeats: 50,
        availableSeats: 50,
        seatLayout: generateLayout(),
      },
      {
        name: 'Tech Innovators Conference 2026',
        description:
          'The biggest gathering of developers, startups, and tech enthusiasts. Connect and learn.',
        dateTime: new Date('2026-08-20T09:00:00Z'),
        venue: 'Moscone Center, San Francisco',
        totalSeats: 50,
        availableSeats: 50,
        seatLayout: generateLayout(),
      },
      {
        name: 'Standup Comedy Night: The Legends',
        description:
          'A night full of laughter featuring the absolute top comedians in the world right now.',
        dateTime: new Date('2026-07-05T20:30:00Z'),
        venue: 'The Comedy Cellar, New York',
        totalSeats: 50,
        availableSeats: 50,
        seatLayout: generateLayout(),
      },
    ];

    await Event.insertMany(dummyEvents);
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
