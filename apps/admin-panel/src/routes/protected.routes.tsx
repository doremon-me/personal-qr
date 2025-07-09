import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({
  children,
  isAuthenticated,
  type,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  type: "AUTHENTICATED" | "UNAUTHENTICATED";
}) => {
  if (type === "AUTHENTICATED" && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (type === "UNAUTHENTICATED" && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};