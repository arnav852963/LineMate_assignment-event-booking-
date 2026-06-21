import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import CoverImage from '../common/CoverImage.jsx';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${event._id}`)}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      <div className="h-56 w-full relative overflow-hidden">
        <CoverImage
          src={event.image}
          alt={event.name}
          className="group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm z-10">
          {event.availableSeats} Seats Left
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2 line-clamp-2">
          {event.name}
        </h3>
        <p className="text-stone-500 text-sm mb-6 line-clamp-2">{event.description}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 text-stone-600 text-sm">
            <Calendar size={16} className="text-orange-800" />
            <span>
              {new Date(event.dateTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 text-sm">
            <MapPin size={16} className="text-orange-800" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100">
          <button className="w-full py-3 flex items-center justify-center gap-2 bg-stone-50 text-stone-900 font-medium rounded-xl group-hover:bg-orange-800 group-hover:text-white transition-colors duration-300">
            <TicketIcon size={18} />
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
