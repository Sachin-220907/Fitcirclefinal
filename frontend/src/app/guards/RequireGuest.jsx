import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/authentication/context/AuthContext";

export function RequireGuest() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RequireGuest;
