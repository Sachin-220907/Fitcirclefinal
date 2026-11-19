import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/authentication/context/AuthContext";

export function RequireAdmin() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}

export default RequireAdmin;
