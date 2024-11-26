// src/axiosConfig.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "http://localhost:8000", // Replace with your actual API base URL
    withCredentials: true,
});
api.defaults.withCredentials = true;
// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage

        const token = localStorage.getItem("token");
        if (token) {
            // If token exists, set Authorization header
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default api;
