import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
