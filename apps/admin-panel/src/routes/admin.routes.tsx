import { Navigate, Route } from "react-router-dom";
import { ProtectedRoutes } from "./protected.routes";
import DashboardLayout from "@/pages/dashboard/layout";
import User from "@/pages/dashboard/user/User";

export const AdminRoutes = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  return (
    <Route
      path="/dashboard"
      element={
        <ProtectedRoutes isAuthenticated={isAuthenticated} type="AUTHENTICATED">
          <DashboardLayout />
        </ProtectedRoutes>
      }
    >
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<User />} />
    </Route>
  );
};
