import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import Button from "../components/Button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setRequirements({
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const isPasswordValid = Object.values(requirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet all requirements ❌");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });
      toast.success("Account created successfully! 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const getIndicatorClass = (condition) =>
    condition ? "text-green-600 font-medium" : "text-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80 animate-fadeIn"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 mb-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        
        <div className="text-xs mb-3 space-y-1">
          <p className={getIndicatorClass(requirements.length)}>
            {requirements.length ? "✅" : "❌"} At least 8 characters
          </p>
          <p className={getIndicatorClass(requirements.upper)}>
            {requirements.upper ? "✅" : "❌"} Contains uppercase letter
          </p>
          <p className={getIndicatorClass(requirements.lower)}>
            {requirements.lower ? "✅" : "❌"} Contains lowercase letter
          </p>
          <p className={getIndicatorClass(requirements.number)}>
            {requirements.number ? "✅" : "❌"} Contains a number
          </p>
          <p className={getIndicatorClass(requirements.special)}>
            {requirements.special ? "✅" : "❌"} Contains a special character
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !isPasswordValid}
          variant={loading ? "gray" : "primary"}
        >
          {loading ? "Creating..." : "Sign Up"}
        </Button>

        <p className="text-sm text-center mt-3 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
