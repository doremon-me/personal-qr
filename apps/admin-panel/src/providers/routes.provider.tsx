import { useUser } from "@/hooks/useUser";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRoutes } from "@/routes/auth.routes";
import { AdminRoutes } from "@/routes/admin.routes";

const RoutesProvider = () => {
  const { data: user } = useUser();
  return (
    <Routes>
      <Route
        index
        element={<Navigate replace to={user ? "/dashboard" : "/auth/signin"} />}
      />

      {AuthRoutes({ isAuthenticated: user !== null && user !== undefined })}

      {AdminRoutes({ isAuthenticated: user !== null && user !== undefined })}
    </Routes>
  );
};

export default RoutesProvider;
