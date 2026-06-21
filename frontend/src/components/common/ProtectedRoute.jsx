import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, authRequire = true }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (authRequire && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authRequire && isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children;
}
