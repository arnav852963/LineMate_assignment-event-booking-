import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventApi } from '../../api/event.api.js';
import CoverImage from '../common/CoverImage.jsx';
import SeatMap from './SeatMap.jsx';
import CheckoutBar from './CheckoutBar.jsx';
import { Calendar, MapPin } from 'lucide-react';

export default function EventDetailsView() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventApi.getEventById(eventId);
        setEvent(res.data.data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-texture">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-orange-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 text-center text-stone-600 bg-texture">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-40">
      <div className="w-full h-[60vh] relative bg-stone-900 border-b border-stone-200">
        <CoverImage src={event.image} alt={event.name} className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-6 w-full pb-16">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              {event.name}
            </h1>
            <div className="flex flex-col md:flex-row gap-6 text-stone-200 font-medium text-lg">
              <div className="flex items-center gap-3 bg-stone-800/50 backdrop-blur px-4 py-2 rounded-full border border-stone-700/50">
                <Calendar className="text-orange-500" size={20} />
                <span>
                  {new Date(event.dateTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-stone-800/50 backdrop-blur px-4 py-2 rounded-full border border-stone-700/50">
                <MapPin className="text-orange-500" size={20} />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">About this event</h2>
            <p className="text-stone-600 leading-relaxed text-lg mb-8">{event.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#F3EFE9] p-5 rounded-3xl border border-[#E5D8C5] flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-[#A89C86] uppercase tracking-widest mb-1">
                  Total Seats
                </div>
                <div className="font-serif text-3xl font-bold text-stone-900">
                  {event.totalSeats}
                </div>
              </div>
              <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
                  Seats Left
                </div>
                <div className="font-serif text-3xl font-bold text-orange-800">
                  {event.availableSeats}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 relative">
            <div>
              <h3 className="text-center font-bold text-stone-400 tracking-widest uppercase mb-12">
                Stage
              </h3>
              <SeatMap
                event={event}
                setEvent={setEvent}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
              />
            </div>
          </div>
        </div>
      </div>

      <CheckoutBar
        selectedSeats={selectedSeats}
        event={event}
        setSelectedSeats={setSelectedSeats}
      />
    </div>
  );
}
