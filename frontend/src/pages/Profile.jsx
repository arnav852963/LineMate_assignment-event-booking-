import { useEffect, useState } from 'react';
import { bookingApi } from '../api/booking.api.js';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import BookingCard from '../components/profile/BookingCard.jsx';
import { toast } from 'react-toastify';

export default function Profile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingApi.getMyBookings();
        setBookings(res.data.data);
      } catch (err) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelSuccess = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) =>
        b._id === updatedBooking._id
          ? { ...b, status: updatedBooking.status, seats: updatedBooking.seats }
          : b,
      ),
    );
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-stone-900">Your Profile</h1>
          <p className="text-stone-500 mt-2">Manage your account and preferences.</p>
        </div>

        <ProfileHeader />

        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">Your Bookings</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-orange-800 rounded-full animate-spin"></div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎟️</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">No bookings yet</h3>
              <p className="text-stone-500">When you book tickets, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
