



import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on login & signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b border-gray-100 rounded-xl mb-6">
      {/* Left Side - App Title */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-700 transition"
      >
        TaskFlow ⏱️
      </h1>

      {/* Right Side - User & Logout */}
      <div className="flex items-center gap-4">
        {user?.email && (
          <p className="text-gray-600 text-sm hidden sm:block">
            👤 {user.email}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
