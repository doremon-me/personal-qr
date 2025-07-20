import { useEffect } from "react";
import { clearUserData } from "./api";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await clearUserData();
      } catch (error) {
        console.log("Logout error:", error);
      }

      window.location.href = "/auth/signin";
    };
    logout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
