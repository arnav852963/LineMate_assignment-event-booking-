import { Calendar, MapPin, Ticket, XCircle, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { bookingApi } from '../../api/booking.api.js';
import { toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF.jsx';

export default function BookingCard({ booking, onCancelSuccess }) {
  const { event, seats, status, createdAt, _id } = booking;

  if (!event) {
    return (
      <div className="p-6 rounded-3xl border-2 border-stone-200 bg-stone-50 opacity-75">
        <p className="font-bold text-stone-500">This event is no longer available.</p>
        <p className="text-sm text-stone-400 mt-2">Booking ID: {_id}</p>
      </div>
    );
  }

  const isCancelled = status === 'CANCELLED';
  const [showModal, setShowModal] = useState(false);
  const [selectedToCancel, setSelectedToCancel] = useState([]);
  const [isCancelling, setIsCancelling] = useState(false);

  const normalizedSeats = seats.map((s) => (typeof s === 'string' ? { seatId: s, price: 0 } : s));
  const totalAmount = normalizedSeats.reduce((sum, s) => sum + (s.price || 0), 0);

  const getSeatTier = (seatId) => {
    const match = seatId.match(/R(\d+)-S\d+/);
    const rowNum = match ? parseInt(match[1], 10) : 1;
    if (rowNum <= 5) return 'Premium';
    if (rowNum <= 10) return 'Gold';
    return 'Silver';
  };

  const getTierColor = (tier, isSelected) => {
    if (isSelected) return 'bg-red-50 border-red-300 text-red-800 shadow-inner';
    if (tier === 'Premium')
      return 'bg-orange-100/50 border-[#C8BAA3] text-orange-900 hover:border-orange-400 hover:bg-orange-100 shadow-sm';
    if (tier === 'Gold')
      return 'bg-[#F3EFE9] border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-[#E5D8C5] shadow-sm';
    return 'bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50 shadow-sm';
  };

  const handleSeatToggle = (seatId) => {
    setSelectedToCancel((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId],
    );
  };

  const handleConfirmCancel = async () => {
    if (selectedToCancel.length === 0) {
      toast.error('Please select at least one seat to cancel.');
      return;
    }

    setIsCancelling(true);
    try {
      const refundAmount = normalizedSeats
        .filter((s) => selectedToCancel.includes(s.seatId))
        .reduce((sum, s) => sum + (s.price || 0), 0);

      const res = await bookingApi.cancelBooking({
        bookingId: _id,
        seatsToCancel: selectedToCancel,
      });

      if (refundAmount > 0) {
        toast.success(
          `Successfully cancelled! ₹${refundAmount} will be refunded to your original payment method.`,
          {
            icon: '💸',
            className: '!bg-green-50 !text-green-900 !border-green-200 font-bold',
          },
        );
      } else {
        toast.success('Selected seats have been successfully released.');
      }

      if (onCancelSuccess) onCancelSuccess(res.data.data);
      setShowModal(false);
      setSelectedToCancel([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div
        className={`p-6 rounded-3xl border-2 transition-all ${isCancelled ? 'bg-stone-50 border-stone-200 opacity-75' : 'bg-[#F3EFE9] border-[#E5D8C5] shadow-sm hover:shadow-md hover:-translate-y-1'}`}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {event.image && (
            <img
              src={event.image}
              alt={event.name}
              className={`w-full md:w-32 h-32 object-cover rounded-2xl ${isCancelled ? 'grayscale' : ''}`}
            />
          )}

          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-start">
              <Link to={`/events/${event._id}`} className="hover:text-orange-700 transition-colors">
                <h3 className="font-serif text-2xl font-bold text-stone-900">{event.name}</h3>
              </Link>
              <div
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isCancelled ? 'bg-stone-200 text-stone-600' : 'bg-green-100 text-green-800'}`}
              >
                {status}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-sm font-medium text-stone-600">
              <div className="flex items-center gap-2">
                <Calendar
                  size={16}
                  className={isCancelled ? 'text-stone-400' : 'text-orange-500'}
                />
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
              <div className="flex items-center gap-2">
                <MapPin size={16} className={isCancelled ? 'text-stone-400' : 'text-orange-500'} />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border min-w-[140px] flex flex-col justify-between ${isCancelled ? 'bg-stone-100 border-stone-200' : 'bg-white border-[#E5D8C5]'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Ticket
                    size={16}
                    className={isCancelled ? 'text-stone-400' : 'text-orange-500'}
                  />
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Seats
                  </span>
                </div>
                {totalAmount > 0 && (
                  <span className="text-xs font-bold text-orange-800">₹{totalAmount}</span>
                )}
              </div>
              <div className="font-bold text-stone-900">
                {normalizedSeats.length > 0
                  ? normalizedSeats.map((s) => s.seatId).join(', ')
                  : 'None'}
              </div>
              <div className="text-xs text-stone-500 mt-2 mb-4">
                Booked on {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-4">
              {!isCancelled && normalizedSeats.length > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-sm rounded-xl transition-colors"
                >
                  <XCircle size={16} />
                  Cancel Tickets
                </button>
              )}

              {normalizedSeats.length > 0 && (
                <PDFDownloadLink
                  document={
                    <InvoicePDF
                      booking={booking}
                      normalizedSeats={normalizedSeats}
                      totalAmount={totalAmount}
                    />
                  }
                  fileName={`invoice-${_id}.pdf`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold text-sm rounded-xl transition-colors"
                >
                  {({ loading }) => (
                    <>
                      <Download size={16} />
                      {loading ? 'Generating...' : 'Download Invoice'}
                    </>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => !isCancelling && setShowModal(false)}
          ></div>

          <div className="relative bg-[#F3EFE9] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#E5D8C5] animate-[slideUp_0.2s_ease-out_forwards]">
            <button
              onClick={() => setShowModal(false)}
              disabled={isCancelling}
              className="absolute top-6 right-6 p-2 bg-white rounded-full text-stone-400 hover:text-stone-900 shadow-sm border border-stone-200 disabled:opacity-50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">Modify Booking</h2>
              <p className="text-stone-500 font-medium">
                Select the seats you want to cancel. This action cannot be undone.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 mb-8 shadow-sm">
              <span className="block font-bold text-stone-400 uppercase text-xs tracking-wider mb-4">
                Your Active Seats
              </span>
              <div className="grid grid-cols-2 gap-3">
                {normalizedSeats.map((seat) => {
                  const tier = getSeatTier(seat.seatId);
                  const isSelected = selectedToCancel.includes(seat.seatId);
                  return (
                    <button
                      key={seat.seatId}
                      onClick={() => handleSeatToggle(seat.seatId)}
                      className={`p-3 rounded-xl transition-all border-2 flex items-center justify-between text-left ${getTierColor(tier, isSelected)}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{seat.seatId}</span>
                        <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">
                          {tier} {seat.price > 0 ? `· ₹${seat.price}` : ''}
                        </span>
                      </div>
                      {isSelected && <XCircle size={20} className="text-red-500 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={isCancelling}
                className="flex-1 py-4 font-bold text-stone-500 hover:text-stone-900 bg-white border-2 border-stone-200 rounded-full transition-colors disabled:opacity-50"
              >
                Keep Seats
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling || selectedToCancel.length === 0}
                className="flex-[2] py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling
                  ? 'Processing...'
                  : `Cancel ${selectedToCancel.length} Seat${selectedToCancel.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
