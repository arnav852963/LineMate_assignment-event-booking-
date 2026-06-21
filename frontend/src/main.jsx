import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/index.js';
import './index.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import EventDetails from './pages/EventDetails.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute authRequire={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <ProtectedRoute authRequire={false}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute authRequire={true}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/event/:eventId',
        element: (
          <ProtectedRoute authRequire={true}>
            <EventDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
);
