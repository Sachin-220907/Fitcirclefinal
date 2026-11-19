import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/authentication/context/AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading FitCircle...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  // Mandatory Onboarding Check:
  // If user signed up but hasn't completed mandatory height, weight, gender measurements, force onboarding!
  if (!user.onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
