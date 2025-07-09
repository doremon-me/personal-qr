import { apiInstance } from "@/lib/api"
import { queryClient } from "@/providers/query.provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast"

const oAuthSignin = async (code: string) => {
    const response = await apiInstance.get(`/auth/google/redirect?code=${code}`);
    return response.data;
}

export const useOAuthSignin = (code: string) => {
    return useQuery({
        queryKey: ["admin-oauth-signin"],
        queryFn: () => oAuthSignin(code),
        enabled: !!code,
    });
}

const signout = async () => {
    const response = await apiInstance.post("/auth/signout");
    return response.data;
}

export const useSignout = () => {
    return useMutation({
        mutationKey: ["admin-signout"],
        mutationFn: () => signout(),
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            queryClient.setQueryData(["admin-oauth-signin"], null);
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "An error occurred while signing out");
        },
    })
}