import { useState, useEffect } from "react";
import apiClient from "../api/apiClint";

interface UseAuthReturn {
  isLoaded: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  id: string;
  redirectToSignin: () => void;
}

const ENDPOINT = {
  verifyUser: "/auth/verify",
};

const useAuth = (): UseAuthReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.get(ENDPOINT.verifyUser, {
        withCredentials: true,
      });

      if (response.data && response.data.id) {
        sessionStorage.setItem("userData", JSON.stringify(response.data));
        setIsAuthenticated(true);
        setId(response.data.id);

        // Check verification status
        const { isNumberVerified, isEmailVerified } = response.data;
        const userIsVerified = isNumberVerified || isEmailVerified;
        setIsVerified(userIsVerified);

        // If user has ID but BOTH verification fields are false, redirect to signin
        if (!isNumberVerified && !isEmailVerified) {
          console.log(
            "User is not verified (both fields false), redirecting to signin page"
          );
          window.location.href = "/auth/signinpage";
          return;
        }
      } else {
        setIsAuthenticated(false);
        setIsVerified(false);
        setId("");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setIsVerified(false);
      setId("");
    } finally {
      setIsLoaded(true);
    }
  };

  const redirectToSignin = () => {
    window.location.href = "/auth/signinpage";
  };

  return {
    isLoaded,
    isAuthenticated,
    isVerified,
    id,
    redirectToSignin,
  };
};

export default useAuth;
