import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 