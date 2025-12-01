// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/login.jpg";           // ← FIXED: IMPORT IMAGE
import { useAuth } from "../context/AuthContext";    // ← UNCOMMENT THIS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();  // ← UNCOMMENT THIS

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      const user = {
        id: data.id,
        name: data.name || email.split("@")[0],
        email: data.email,
        role: data.role,
      };

      login(user);  // ← This saves to AuthContext + localStorage

      alert(`Welcome back, ${user.name}!`);

      const roleLower = user.role.toLowerCase();
      if (roleLower.includes("fleet")) {
        navigate("/dashboard/fleetmanager");
      } else if (roleLower === "driver") {
        navigate("/dashboard/driver");
      } else if (roleLower === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/customer");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 bg-gradient-to-bl from-indigo-50 to-purple-300">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              NeuroFleetX
            </h1>
            <p className="text-xl text-indigo-700 font-medium mt-2">AI-Powered Fleet Management</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-purple-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <input
                type="email"
                placeholder="fleet@neurofleetx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition text-lg"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition text-lg"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all transform hover:scale-105 shadow-xl ${
                  loading ? "bg-gray-500" : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                {loading ? "Signing In..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-indigo-600 hover:underline">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-300 p-8">
        <img
          src={loginBg}
          alt="NeuroFleetX Logistics"
          className="max-h-[85vh] rounded-3xl shadow-2xl border-8 border-white/50"
        />
      </div>
    </div>
  );
};

export default Login;