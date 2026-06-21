import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Ticket, LogOut, User } from 'lucide-react';
import { logoutSuccess } from '../../store/authSlice.js';
import { authApi } from '../../api/auth.api.js';

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logoutSuccess());
      navigate('/');
    } catch (err) {
      console.error('Failed to logout', err);
      dispatch(logoutSuccess());
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-texture bg-white/60 backdrop-blur-md border-b border-stone-200 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-orange-800 p-2 rounded-full text-white group-hover:scale-105 transition-transform">
            <Ticket size={20} />
          </div>
          <span className="font-serif text-xl font-bold text-stone-800 tracking-tight">Aura</span>
        </Link>

        <div className="flex-grow"></div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2"
                title="Profile"
              >
                <div className="bg-stone-200 p-1.5 rounded-full">
                  <User size={18} className="text-stone-700" />
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-bold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-bold bg-stone-900 text-white rounded-full hover:bg-orange-800 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
