import axios from "axios";
import { toast } from "sonner"; // optional if you want popup

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// 🧩 Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚙️ Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // 🕒 Detect expired token response
      if (status === 401 && data?.message === "Token expired") {
        console.warn("⏰ Session expired. Logging out automatically.");

        // Optional toast message
        toast.error("Your session expired. Please log in again.");

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";
      }

     
    }
    return Promise.reject(error);
  }
);

export default api;
