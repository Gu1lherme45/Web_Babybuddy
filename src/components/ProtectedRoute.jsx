import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import LoadingWave from './LoadingWave';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingWave />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && user.nivelAcesso?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/perfil" replace />;
  }
  return children;
}
