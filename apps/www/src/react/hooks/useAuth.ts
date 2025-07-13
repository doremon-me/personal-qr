import { useState, useEffect } from "react";
import apiClient from "../api/apiClint";

interface UseAuthReturn {
  isLoaded: boolean;
  isAuthenticated: boolean;
  id: string;
}

const ENDPOINT = {
  verifyUser: "/auth/verify",
};

const useAuth = (): UseAuthReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      } else {
        setIsAuthenticated(false);
        setId("");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setId("");
    } finally {
      setIsLoaded(true);
    }
  };

  return {
    isLoaded,
    isAuthenticated,
    id,
  };
};

export default useAuth;
