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
  // For testing, be less strict about authentication
  if (type === "AUTHENTICATED" && !isAuthenticated) {
    // Only redirect if we're sure the user is not authenticated
    return <Navigate to="/auth/signin" replace />;
  }
  if (type === "UNAUTHENTICATED" && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};