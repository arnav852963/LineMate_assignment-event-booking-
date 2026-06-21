import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, authRequire = true }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (authRequire && !isAuthenticated) {
    // User is not logged in but trying to access a protected route (e.g. /event/123)
    // We redirect them to /login and pass their intended destination in the state!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authRequire && isAuthenticated) {
    // User is already logged in but trying to access an unauth route (e.g. /login)
    return <Navigate to="/" replace />;
  }

  return children;
}
