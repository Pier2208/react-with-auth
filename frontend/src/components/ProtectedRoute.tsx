import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function ProtectedRoute() {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}
