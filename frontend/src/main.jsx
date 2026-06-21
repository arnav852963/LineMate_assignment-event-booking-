import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import './index.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

const LoginPlaceholder = () => (
  <div className="pt-32 text-center text-stone-600">Login Page Component</div>
);
const ProfilePlaceholder = () => (
  <div className="pt-32 text-center text-stone-600">Profile Dashboard Component</div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute authRequire={false}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute authRequire={false}>
            <LoginPlaceholder />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute authRequire={true}>
            <ProfilePlaceholder />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
