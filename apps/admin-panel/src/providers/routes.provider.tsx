import { useUser } from "@/hooks/useUser";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthRoutes } from "@/routes/auth.routes";
import { AdminRoutes } from "@/routes/admin.routes";

const RoutesProvider = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/auth');
  
  // Only check user authentication if we're not on auth routes
  const { data: user } = useUser(!isAuthRoute);
  
  // For auth routes, don't wait for user verification
  const isAuthenticated = user !== null && user !== undefined;

  return (
    <Routes>
      <Route
        index
        element={<Navigate replace to={isAuthenticated ? "/dashboard/users" : "/auth/signin"} />}
      />

      {AuthRoutes({ isAuthenticated })}

      {AdminRoutes({ isAuthenticated })}
    </Routes>
  );
};

export default RoutesProvider;
