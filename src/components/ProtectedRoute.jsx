import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const acesso = sessionStorage.getItem("acesso");

  if (!acesso) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;