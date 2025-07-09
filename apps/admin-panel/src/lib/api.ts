import axios from 'axios';

export const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_BACK_END,
    withCredentials: true,
})