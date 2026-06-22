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
      <div className="w-full min-h-[50vh] md:h-[60vh] relative overflow-hidden border-b border-stone-800 flex items-end bg-stone-950">
        {/* Ambient Blurred Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?auto=format&fit=crop&w=800&q=80'} 
            alt="ambient background" 
            className="w-full h-full object-cover opacity-90 blur-[80px] scale-110 saturate-200"
          />
        </div>

        {/* Subtle dark gradient overlay to ensure text is always readable against the blurred image */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/10 z-0"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-12 flex flex-col md:flex-row items-end md:items-end gap-8 md:gap-12">
          
          {/* Event Poster Image (Natural Proportions) */}
          <div className="w-full max-w-sm md:w-1/3 shrink-0 mx-auto md:mx-0">
            <img 
              src={event.image || 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?auto=format&fit=crop&w=800&q=80'} 
              alt={event.name} 
              className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border-4 border-stone-800/50" 
            />
          </div>

          {/* Event Details Text */}
          <div className="w-full md:w-2/3 flex flex-col justify-end text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              {event.name}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 text-stone-200 font-medium text-sm md:text-lg justify-center md:justify-start">
              <div className="flex items-center gap-3 bg-stone-800/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-700/50 shadow-sm w-max mx-auto md:mx-0">
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
              <div className="flex items-center gap-3 bg-stone-800/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-700/50 shadow-sm w-max mx-auto md:mx-0">
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
