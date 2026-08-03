import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Não está logado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Área exclusiva do administrador
  if (adminOnly && !usuario.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}