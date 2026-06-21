import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../models/event.model.js';
import { DB_NAME } from '../../constants.js';

dotenv.config({ path: './.env' });

const seedEvents = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error(
        'MONGO_URL is missing. Please make sure your .env file is loaded correctly.'
      );
    }

    await mongoose.connect(process.env.MONGO_URL + DB_NAME);

    await Event.deleteMany({});

    const generateLayout = (totalSeats) => {
      const layout = [];

      let seatCount = 0;

      for (let row = 1; seatCount < totalSeats; row++) {
        for (let seat = 1; seat <= 10 && seatCount < totalSeats; seat++) {
          layout.push({
            seatId: `R${row}-S${seat}`,
            status: 'AVAILABLE',
            lockedBy: null,
            lockExpiresAt: null,
          });

          seatCount++;
        }
      }

      return layout;
    };

    const dummyEvents = [
      {
        name: 'Arijit Singh India Tour 2026',
        description:
          'Experience an unforgettable live performance by Arijit Singh featuring his greatest hits.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058476/arijit_znwzxc.png',
        dateTime: new Date('2026-07-12T19:00:00Z'),
        venue: 'Jawaharlal Nehru Stadium, Delhi',
        totalSeats: 500,
        availableSeats: 500,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(500),
      },
      {
        name: 'Sunburn Goa Festival 2026',
        description:
          'India’s biggest electronic dance music festival featuring world-renowned DJs.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058553/sunburn-goa_qw6onh.png',
        dateTime: new Date('2026-12-28T17:00:00Z'),
        venue: 'Vagator Beach, Goa',
        totalSeats: 500,
        availableSeats: 500,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(500),
      },
      {
        name: 'India Tech Summit 2026',
        description:
          'A premier technology conference bringing together startups, developers, and industry leaders.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058476/indian-tech-sumit_fakflz.png',
        dateTime: new Date('2026-09-10T09:00:00Z'),
        venue: 'Bharat Mandapam, New Delhi',
        totalSeats: 250,
        availableSeats: 250,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(250),
      },
      {
        name: 'Bengaluru Startup Expo 2026',
        description:
          'Showcasing India’s most innovative startups, investors, and entrepreneurs.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058476/bangalore-startup_veimuo.png',
        dateTime: new Date('2026-08-15T10:00:00Z'),
        venue: 'Bangalore International Exhibition Centre, Bengaluru',
        totalSeats: 250,
        availableSeats: 250,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(250),
      },
      {
        name: 'Zakir Khan Live',
        description:
          'An evening of laughter and storytelling with one of India’s most loved comedians.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058572/zakir_khan_y7iu0b.png',
        dateTime: new Date('2026-07-25T19:30:00Z'),
        venue: 'Shanmukhananda Hall, Mumbai',
        totalSeats: 150,
        availableSeats: 150,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(150),
      },
      {
        name: 'Jaipur Literature Festival 2026',
        description:
          'A celebration of books, ideas, and conversations with renowned authors and thinkers.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058551/jaipur_f1rpc9.png',
        dateTime: new Date('2026-01-23T10:00:00Z'),
        venue: 'Diggi Palace, Jaipur',
        totalSeats: 300,
        availableSeats: 300,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(300),
      },
      {
        name: 'Comic Con India Mumbai 2026',
        description:
          'The biggest gathering of comic book fans, gamers, cosplayers, and pop culture enthusiasts.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058513/comiccon_sv5iiv.png',
        dateTime: new Date('2026-11-14T11:00:00Z'),
        venue: 'Jio World Convention Centre, Mumbai',
        totalSeats: 450,
        availableSeats: 450,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(450),
      },
      {
        name: 'NH7 Weekender Pune 2026',
        description:
          'India’s happiest music festival featuring top national and international artists.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058558/NHH-7_miqmek.png',
        dateTime: new Date('2026-11-28T15:00:00Z'),
        venue: 'Mahalaxmi Lawns, Pune',
        totalSeats: 450,
        availableSeats: 450,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(450),
      },
      {
        name: 'India Gaming Championship 2026',
        description:
          'The ultimate esports showdown featuring top teams from across the country.',
        image:
          'https://res.cloudinary.com/dyld0tdro/image/upload/v1782058477/indian_gaming_rusdcm.png',
        dateTime: new Date('2026-10-03T12:00:00Z'),
        venue: 'Hitex Exhibition Center, Hyderabad',
        totalSeats: 200,
        availableSeats: 200,
        pricing: { tier1: 3000, tier2: 2000, tier3: 1000 },
        seatLayout: generateLayout(200),
      },
    ];

    await Event.insertMany(dummyEvents);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedEvents();
