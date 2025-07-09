import { Navigate, Route } from "react-router-dom";
import { ProtectedRoutes } from "./protected.routes";
import Verify from "@/pages/auth/Verify";
import Signin from "@/pages/auth/Signin";

export const AuthRoutes = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  return (
    <Route path="/auth">
      <Route index element={<Navigate replace to={"/auth/signin"} />} />
      <Route
        path="signin"
        element={
          <ProtectedRoutes
            isAuthenticated={isAuthenticated}
            type="UNAUTHENTICATED"
          >
            <Signin />
          </ProtectedRoutes>
        }
      />
      <Route
        path="verifycode"
        element={
          <ProtectedRoutes
            isAuthenticated={isAuthenticated}
            type="UNAUTHENTICATED"
          >
            <Verify />
          </ProtectedRoutes>
        }
      />
    </Route>
  );
};
