import { Navigate, useLocation } from "react-router-dom";
import { getStoredRole, type AppRole } from "@/lib/auth";

export function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: AppRole }) {
  const location = useLocation();
  const storedRole = getStoredRole();
  if (!storedRole) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (role && storedRole !== role) return <Navigate to={storedRole === "admin" ? "/command-center" : "/"} replace />;
  return <>{children}</>;
}
