import { Navigate, Route } from "react-router-dom";
import { ProtectedRoutes } from "./protected.routes";
import DashboardLayout from "@/pages/dashboard/layout";
import HomeLayout from "@/pages/dashboard/home/layout";
import Home from "@/pages/dashboard/home/Home";
import Contact from "@/pages/dashboard/home/Contact";
import Token from "@/pages/dashboard/home/Token";
import User from "@/pages/dashboard/user/User";
import Cafe from "@/pages/dashboard/cafe/Cafe";
import Transactions from "@/pages/dashboard/transaction/Transactions";

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
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<HomeLayout />}>
        <Route index element={<Navigate to="expiry" replace />} />
        <Route path="expiry" element={<Home />} />
        <Route path="contacts" index element={<Contact />} />
        <Route path="token" index element={<Token />} />
      </Route>
      <Route path="users" element={<User />} />
      <Route path="cafes" element={<Cafe />} />
      <Route path="transactions" element={<Transactions />} />
    </Route>
  );
};
