import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ auth, roles = [], children }) => {
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(auth.user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PrivateRoute;
