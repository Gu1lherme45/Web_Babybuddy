import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import LoadingWave from './LoadingWave';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const bypass = import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true';

  if (loading) return <LoadingWave />;
  if (!user && !bypass) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !bypass && user.nivelAcesso?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/perfil" replace />;
  }
  return children;
}
