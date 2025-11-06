// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import Button from "./Button";

// export default function Navbar() {
//   const { token, logout, user } = useAuth(); 
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully!");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50">
     
//       <h1
//         onClick={() => navigate("/")}
//         className="text-xl font-bold text-blue-600 cursor-pointer"
//       >
//         TaskTracker
//       </h1>

//       {/* Right Section */}
//       {token && (
//         <div className="flex items-center gap-4">
     
//           <p className="text-gray-600 text-sm hidden sm:block">
//             Welcome, <span className="font-medium text-gray-800">{user?.email}</span>
//           </p>

//           <Button onClick={handleLogout} variant="danger">
//             Logout
//           </Button>
//         </div>
//       )}
//     </nav>
//   );
// }


// src/components/Navbar.jsx
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully! 👋");
//     navigate("/login");
//   };

//   return (
//     <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b border-gray-100 rounded-xl mb-6">
//       {/* Left Side - App Title */}
//       <h1
//         onClick={() => navigate("/")}
//         className="text-xl font-semibold text-blue-600 cursor-pointer hover:text-blue-700 transition"
//       >
//         TaskFlow ⏱️
//       </h1>

//       {/* Right Side - User & Logout */}
//       <div className="flex items-center gap-4">
//         {user?.email && (
//           <p className="text-gray-600 text-sm hidden sm:block">
//             👤 {user.email}
//           </p>
//         )}

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }



import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hide Navbar on login & signup pages
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
