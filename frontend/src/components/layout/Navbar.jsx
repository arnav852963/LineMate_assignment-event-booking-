import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Ticket } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl bg-white/70 backdrop-blur-md shadow-sm rounded-full px-6 py-3 flex items-center justify-between border border-stone-200">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-800 p-2 rounded-full text-white group-hover:scale-105 transition-transform">
            <Ticket size={20} />
          </div>
          <span className="font-serif text-xl font-bold text-stone-800 tracking-tight">Aura</span>
        </Link>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-sm font-medium bg-stone-900 text-stone-50 px-5 py-2 rounded-full hover:bg-orange-800 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                My Tickets
              </Link>
              <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-sm">
                <img
                  src={
                    user?.profilePhoto ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
