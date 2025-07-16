import Loader from "@/components/shared/loader";
import { useVerifyUser } from "./api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/providers/query.provider";

const Verify = () => {
  const navigate = useNavigate();
  const { isLoading, isError, data, error } = useVerifyUser(true);

  useEffect(() => {
    if (data) {
      // Only set user data after successful verification
      queryClient.setQueryData(["user"], data);
      navigate("/dashboard", { replace: true });
    }
    if (!isLoading && isError) {
      console.error("Verification failed:", error);
      navigate("/auth/signin", { replace: true });
    }
  }, [isLoading, isError, data, error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader size="md" variant="fullscreen" />
        <p className="mt-4 text-muted-foreground">Verifying your account...</p>
      </div>
    </div>
  );
};

export default Verify;
