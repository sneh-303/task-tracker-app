
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Intercept API responses for auto logout if token gets expired
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status, data } = error.response || {};

        if (status === 401 && data?.message?.includes("expired")) {
          console.warn("Token expired — logging out immediately.");
          logout(true);
        }

        if (status === 401 && data?.message?.includes("Invalid")) {
          console.warn("Invalid token — logging out immediately.");
          logout(true);
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // Keep token synced with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Keep user synced with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Login
  const login = (data) => {
    const newUser = { id: data.id, email: data.email, name: data.name };
    setUser(newUser);
    setToken(data.token);
    navigate("/dashboard");
  };

  // Logout (manual or automatic)
  const logout = (auto = false) => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (auto) {
      toast.error("Session expired. Please log in again.");
      console.log("Auto logout triggered due to expired token.");
    } else {
      toast.success("Logged out successfully!");
      console.log("User logged out manually.");
    }

    window.location.replace("/login");
  };

  // Client-side auto logout when token expires (timer-based)
  useEffect(() => {
    if (!token) return;

    try {
      // Decoding JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      const remainingTime = expiryTime - Date.now();

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          console.log("JWT reached expiry — logging out automatically.");
          logout(true);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        logout(true);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      logout(true);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
