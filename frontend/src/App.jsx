import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { userApi } from './api/user.api.js';
import { loginSuccess, logoutSuccess } from './store/authSlice.js';

export default function App() {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await userApi.getUser();
        dispatch(loginSuccess(res.data.data));
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            await userApi.refreshUserToken();
            const retryRes = await userApi.getUser();
            dispatch(loginSuccess(retryRes.data.data));
          } catch (refreshErr) {
            dispatch(logoutSuccess());
          }
        } else {
          dispatch(logoutSuccess());
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-texture flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-orange-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-texture selection:bg-orange-800 selection:text-white font-sans text-stone-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
