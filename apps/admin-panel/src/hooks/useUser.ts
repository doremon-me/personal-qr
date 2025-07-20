import { apiInstance } from "@/lib/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export interface User {
    role: string;
    email: string;
    name: string;
    id: string;
}

const getUser = async () => {
    try {
        const response = await apiInstance('/auth/verify');
        return response.data;
    } catch (error) {
        // Return null if verification fails - user is not authenticated
        return null;
    }
}

export const useUser = (enabled: boolean = true): UseQueryResult<User | undefined> => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: enabled,
        retry: false, // Don't retry on error
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}