import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const { usuario, loading } = useAuth();

  // Ainda verificando a sessão com o backend
  if (loading) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <Loader />
      </div>
    );
  }

  // Não está logado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Área exclusiva do administrador
  if (adminOnly && usuario.nivelAcesso !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
