/**
 * Guardia de rutas privadas.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PageLoader } from "../ui/spinner";

/** Protege rutas: si no hay sesión, envía al inicio de sesión. */
export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (!user) {
    return (
      <Navigate to="/signup" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
