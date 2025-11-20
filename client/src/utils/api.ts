import axios from "axios";
import { getAuthToken } from "./auth";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    // Set the Authorization header with the token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});