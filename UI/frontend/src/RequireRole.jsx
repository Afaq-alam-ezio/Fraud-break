import { Navigate } from 'react-router-dom';
import { homeFor, useAuth } from './auth';

// Wraps a page. Not logged in: go to login. Wrong role: go to your own home page.
export default function RequireRole({ role, children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (auth.role !== role) return <Navigate to={homeFor(auth.role)} replace />;
  return children;
}
