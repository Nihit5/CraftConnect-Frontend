import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FDF9F5]">
        <p className="text-sm text-[#6E625A]">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles?.length &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
