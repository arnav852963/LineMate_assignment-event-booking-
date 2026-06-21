import CoverImage from '../components/common/CoverImage.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 md:px-6">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-stone-100 flex overflow-hidden min-h-[600px]">
        <div className="hidden lg:block w-1/2 relative bg-stone-900">
          <CoverImage
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"
            alt="Concert Crowd"
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 to-transparent flex flex-col justify-end p-12">
            <h2 className="font-serif text-4xl text-white font-bold mb-4">Welcome back to Aura.</h2>
            <p className="text-stone-300">
              Your next unforgettable experience is just a few clicks away.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
