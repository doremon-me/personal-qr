import { apiInstance } from "@/lib/api";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export interface User {
    role: string;
    email: string;
    name: string;
    id: string;
}

const getUser = async () => {
    const response = await apiInstance('/auth/verify');
    return response.data;
}

export const useUser = (): UseQueryResult<User | undefined> => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
    })
}