import { useEffect, useState, useRef } from 'react';
import { socket } from '../../socket/socket.js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function SeatMap({ event, setEvent, selectedSeats, setSelectedSeats }) {
  const { user } = useSelector((state) => state.auth);
  const [seats, setSeats] = useState(event.seatLayout || []);

  const columnsPerRow = 10;
  const numRows = Math.ceil(seats.length / columnsPerRow);
  const selectedSeatsRef = useRef(selectedSeats);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    if (!event._id) return;

    socket.emit('joinEventRoom', event._id);

    socket.on('seatLocked', ({ seatId, lockedBy }) => {
      setSeats((prev) =>
        prev.map((s) => (s.seatId === seatId ? { ...s, status: 'LOCKED', lockedBy } : s)),
      );
    });

    socket.on('seatUnlocked', ({ seatId }) => {
      setSeats((prev) =>
        prev.map((s) => (s.seatId === seatId ? { ...s, status: 'AVAILABLE', lockedBy: null } : s)),
      );

      if (selectedSeatsRef.current.some((s) => s.seatId === seatId)) {
        toast.info(`⏳ Time expired! Seat ${seatId} has been released.`, {
          className: '!bg-orange-50 !text-orange-900 !border-orange-200 !font-bold',
          autoClose: 5000,
        });
        setSelectedSeats((prev) => prev.filter((s) => s.seatId !== seatId));
      }
    });

    socket.on('seatsBooked', ({ seats: bookedSeats }) => {
      setSeats((prev) =>
        prev.map((s) =>
          bookedSeats.includes(s.seatId) ? { ...s, status: 'BOOKED', lockedBy: null } : s,
        ),
      );

      if (setEvent) {
        setEvent((prev) => ({
          ...prev,
          availableSeats: Math.max(0, prev.availableSeats - bookedSeats.length),
        }));
      }
    });

    socket.on('seatsUnlocked', ({ seats: unlockedSeats }) => {
      setSeats((prev) =>
        prev.map((s) =>
          unlockedSeats.includes(s.seatId) ? { ...s, status: 'AVAILABLE', lockedBy: null } : s,
        ),
      );

      if (setEvent) {
        setEvent((prev) => ({
          ...prev,
          availableSeats: Math.min(prev.totalSeats, prev.availableSeats + unlockedSeats.length),
        }));
      }
    });

    return () => {
      selectedSeatsRef.current.forEach((seat) => {
        socket.emit('unlockSeat', { eventId: event._id, seatId: seat.seatId, userId: user?._id });
      });

      socket.emit('leaveEventRoom', event._id);
      socket.off('seatLocked');
      socket.off('seatUnlocked');
      socket.off('seatsBooked');
      socket.off('seatsUnlocked');
    };
  }, [event._id, user?._id]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);

    if (isSelected) {
      socket.emit('unlockSeat', { eventId: event._id, seatId: seat.seatId, userId: user?._id });
      setSelectedSeats((prev) => prev.filter((s) => s.seatId !== seat.seatId));
      setSeats((prev) =>
        prev.map((s) =>
          s.seatId === seat.seatId ? { ...s, status: 'AVAILABLE', lockedBy: null } : s,
        ),
      );
    } else {
      if (seat.status !== 'AVAILABLE') return;

      if (selectedSeats.length >= 5) {
        toast.error('You can only book a maximum of 5 seats at a time!', {
          className: '!bg-red-50 !text-red-800 !border-red-200',
        });
        return;
      }

      socket.emit('lockSeat', { eventId: event._id, seatId: seat.seatId, userId: user?._id });
      setSelectedSeats((prev) => [...prev, seat]);
      setSeats((prev) =>
        prev.map((s) =>
          s.seatId === seat.seatId ? { ...s, status: 'LOCKED', lockedBy: user?._id } : s,
        ),
      );
    }
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.some((s) => s.seatId === seat.seatId))
      return 'bg-gradient-to-br from-orange-500 to-orange-700 shadow-[0_4px_15px_-4px_rgba(234,88,12,0.6)] scale-110 z-10 border-none';
    if (seat.status === 'AVAILABLE')
      return 'bg-[#E5D8C5] border-b-4 border-[#C8BAA3] hover:bg-orange-100 hover:border-orange-300 hover:-translate-y-0.5 hover:shadow-md';
    if (seat.status === 'BOOKED')
      return 'bg-stone-800 border-b-4 border-stone-900 opacity-60 cursor-not-allowed';
    if (seat.status === 'LOCKED')
      return 'bg-[#C8BAA3] border-b-4 border-[#B0A38D] cursor-not-allowed opacity-80';
    return 'bg-[#E5D8C5] border-b-4 border-[#C8BAA3]';
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 text-xs md:text-sm font-bold text-stone-600 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#E5D8C5] border-b-4 border-[#C8BAA3] rounded-lg"></div>{' '}
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg"></div>{' '}
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#C8BAA3] border-b-4 border-[#B0A38D] rounded-lg"></div> Locked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-stone-800 border-b-4 border-stone-900 rounded-lg"></div> Sold
          Out
        </div>
      </div>

      <div className="p-8 md:p-12 bg-[#F3EFE9] rounded-[3rem] border-2 border-[#E5D8C5] shadow-xl w-full max-w-4xl overflow-x-auto relative">
        <div className="mb-16 flex flex-col items-center">
          <div className="w-3/4 max-w-md h-12 border-t-[12px] border-orange-800/80 rounded-t-[100%] shadow-[0_-10px_20px_-5px_rgba(234,88,12,0.2)]"></div>
          <div className="text-sm font-black text-orange-900/60 tracking-[0.3em] uppercase mt-4">
            Stage
          </div>
        </div>

        <div className="flex justify-center min-w-max pb-8">
          <div className="flex flex-col gap-3 md:gap-4 pr-6 mr-6 border-r-2 border-[#E5D8C5] pt-[34px] md:pt-[40px]">
            {Array.from({ length: numRows }).map((_, i) => (
              <div
                key={i}
                className="h-10 md:h-12 flex items-center justify-center font-bold text-[#A89C86] text-xs md:text-sm tracking-widest"
              >
                R{i + 1}
              </div>
            ))}
          </div>

          <div>
            <div
              className="grid gap-3 md:gap-4 mb-4"
              style={{ gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columnsPerRow }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 md:w-12 flex justify-center font-bold text-[#A89C86] text-xs md:text-sm"
                >
                  S{i + 1}
                </div>
              ))}
            </div>

            <div
              className="grid gap-3 md:gap-4"
              style={{ gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))` }}
            >
              {seats.map((seat) => (
                <button
                  key={seat.seatId}
                  disabled={
                    seat.status !== 'AVAILABLE' &&
                    !selectedSeats.some((s) => s.seatId === seat.seatId)
                  }
                  onClick={() => handleSeatClick(seat)}
                  title={`Seat ${seat.seatId}`}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-t-2xl rounded-b-lg transition-all duration-300
                    ${getSeatColor(seat)}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
