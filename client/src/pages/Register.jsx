
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock, ArrowRight } from "lucide-react";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert("Account created successfully!");
      navigate(response.data.token ? "/dashboard" : "/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f1] flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <div className="flex justify-center mb-5">
          <div className="bg-green-600 text-white p-3 rounded-2xl">
            <Leaf size={30} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Start tracking your carbon footprint.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <div className="flex items-center border rounded-xl px-4">
              <User size={19} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="flex items-center border rounded-xl px-4">
              <Mail size={19} className="text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Password
            </label>
            <div className="flex items-center border rounded-xl px-4">
              <Lock size={19} className="text-gray-400" />
              <input
                type="password"
                placeholder="Create a password"
                className="w-full p-3 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-8">
          EcoTrack © 2026 · Sustainable Living
        </p>

      </div>
    </div>
  );
}

export default Register;
