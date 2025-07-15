import { apiInstance } from "@/lib/api";
import { queryClient } from "@/providers/query.provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface SigninData {
  number: string;
  password: string;
}

const signin = async (data: SigninData) => {
  const response = await apiInstance.post("/auth/admin/signin", data);
  return response.data;
};

export const useSignin = () => {
  return useMutation({
    mutationKey: ["admin-signin"],
    mutationFn: (data: SigninData) => signin(data),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Signed in successfully.");

      window.location.href = `/dashboard`;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while signing in"
      );
    },
  });
};

const verifyUser = async () => {
  // Use GET request as the backend expects this based on the backend code
  const response = await apiInstance.get(`/auth/verify`);
  return response.data;
};

export const useVerifyUser = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-verify"],
    queryFn: () => verifyUser(),
    enabled: enabled,
  });
};

const signout = async () => {
  const response = await apiInstance.post("/auth/signout");
  return response.data;
};

export const useSignout = () => {
  return useMutation({
    mutationKey: ["admin-signout"],
    mutationFn: () => signout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      toast.success("Signed out successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while signing out"
      );
    },
  });
};

export const clearUserData = () => {
  queryClient.setQueryData(["user"], null);
  queryClient.removeQueries({ queryKey: ["user"] });
  // Clear any auth cookies by calling signout
  return apiInstance.post("/auth/signout").catch(() => {
    // Ignore errors, just clear local data
  });
};
