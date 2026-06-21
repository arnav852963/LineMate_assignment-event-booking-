import { Ticket, X } from 'lucide-react';
import { useState } from 'react';
import { bookingApi } from '../../api/booking.api.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { socket } from '../../socket/socket.js';
import { useSelector } from 'react-redux';

export default function CheckoutBar({ selectedSeats, event, setSelectedSeats }) {
  const { user } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  if (selectedSeats.length === 0) return null;

  const totalPrice = selectedSeats.reduce((acc, seat) => {
    const match = seat.seatId.match(/R(\d+)-S\d+/);
    const rowNum = match ? parseInt(match[1], 10) : 1;

    if (rowNum <= 5) return acc + (event.pricing?.tier1 || 3000);
    if (rowNum <= 10) return acc + (event.pricing?.tier2 || 2000);
    return acc + (event.pricing?.tier3 || 1000);
  }, 0);

  const handleBookTickets = async () => {
    setIsProcessing(true);
    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      await bookingApi.createBooking({ eventId: event._id, seats: seatIds });

      toast('Tickets successfully secured!', {
        icon: '🎟️',
        className:
          '!bg-gradient-to-br !from-orange-50 !to-orange-100 !text-orange-900 !border-orange-200',
      });

      navigate('/profile');
    } catch (err) {
      console.error('Booking failed', err);
      toast.error(
        err.response?.data?.message || 'Failed to book tickets. Some might have been snagged!',
        {
          className: '!bg-red-50 !text-red-800 !border-red-200',
        },
      );
      setShowConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelBooking = () => {
    selectedSeats.forEach((seat) => {
      socket.emit('unlockSeat', { eventId: event._id, seatId: seat.seatId, userId: user?._id });
    });

    if (setSelectedSeats) {
      setSelectedSeats([]);
    }

    setShowConfirm(false);
  };

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 animate-[slideUp_0.3s_ease-out_forwards]">
        <div className="absolute inset-0 bg-[#F3EFE9]/95 backdrop-blur-md border-t-2 border-[#E5D8C5] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#E5D8C5] text-[#7a2e0d] p-3 rounded-xl border border-[#C8BAA3]">
              <Ticket size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#A89C86] uppercase tracking-wider">Total</div>
              <div className="font-serif text-3xl font-bold text-stone-900">₹{totalPrice}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-stone-500 font-medium text-right">
              <span className="font-bold text-stone-900">{selectedSeats.length}</span> seats
              selected
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="px-8 py-4 bg-orange-800 text-white font-bold rounded-full hover:bg-stone-900 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              Checkout
            </button>
          </div>
        </div>

        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => !isProcessing && setShowConfirm(false)}
          ></div>

          <div className="relative bg-[#F3EFE9] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#E5D8C5] animate-[slideUp_0.2s_ease-out_forwards]">
            <button
              onClick={handleCancelBooking}
              disabled={isProcessing}
              className="absolute top-6 right-6 p-2 bg-white rounded-full text-stone-400 hover:text-stone-900 shadow-sm border border-stone-200 disabled:opacity-50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Confirm Booking</h2>
              <p className="text-stone-500 font-medium">{event.name}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 mb-8 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <span className="font-bold text-stone-400 uppercase text-xs tracking-wider">
                  Seats ({selectedSeats.length})
                </span>
                <span className="font-bold text-stone-900 text-right max-w-[180px] leading-tight">
                  {selectedSeats.map((s) => s.seatId).join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-stone-400 uppercase text-xs tracking-wider">
                  Total Payable
                </span>
                <span className="font-serif text-3xl font-bold text-orange-800">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCancelBooking}
                disabled={isProcessing}
                className="flex-1 py-4 font-bold text-stone-500 hover:text-stone-900 bg-white border-2 border-stone-200 rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBookTickets}
                disabled={isProcessing}
                className="flex-[2] py-4 bg-orange-800 text-white font-bold rounded-full hover:bg-stone-900 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center"
              >
                {isProcessing ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
