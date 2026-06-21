import { useState, useEffect } from 'react';
import { eventApi } from '../../api/event.api.js';
import EventCard from './EventCard.jsx';
import SkeletonLoader from '../common/SkeletonLoader.jsx';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAllEvents();
        setEvents(response.data.data);
      } catch (err) {
        setError('Failed to load upcoming events. Please make sure the backend is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {isLoading
        ? [...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-[450px]" />)
        : events.map((event) => <EventCard key={event._id} event={event} />)}
    </div>
  );
}
