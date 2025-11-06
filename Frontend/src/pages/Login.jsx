// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "sonner";
// import Button from "../components/Button";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await api.post("/auth/login", { email, password });
//       login({ email, token: res.data.token });
//       toast.success("Welcome back 👋");
//       navigate("/");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-2xl shadow-md w-80 animate-fadeIn"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
//           required
//         />

//         <Button
//           type="submit"
//           disabled={loading}
//           variant={loading ? "gray" : "primary"}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </Button>

//         <p className="text-sm text-center mt-3 text-gray-600">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login({ email, token: res.data.token });
      toast.success("Welcome back 👋");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80 animate-fadeIn"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "gray" : "primary"}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center mt-3 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
