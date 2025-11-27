import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginBg from "../assets/login.jpg";

// Google OAuth (replace with your real values)
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post("http://localhost:8080/login", {
      email,
      password,
    });

    // Save these 3 things
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);   // ← THIS LINE WAS MISSING!

    navigate(`/dashboard/${data.role.toLowerCase()}`);
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Login failed! Please check your credentials."
    );
  }
};

  const handleGoogleLogin = () => {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&prompt=select_account`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ====================== LEFT: LOGIN FORM + WELCOME TEXT ====================== */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 bg-gradient-to-bl from-indigo-50 to-purple-300 min-h-screen md:min-h-0">
        <div className="w-full max-w-md mx-auto">
          {/* === WELCOME TEXT ABOVE FORM === */}
          <div className="mt-6 text-center mb-5">
            <h1 className="text-3xl font-bold text-indigo-900 mb-1">NeuroFleetX</h1>
            <p className="text-indigo-700">Smart Fleet Management</p>
          </div>

          {/* Glassmorphic Card */}
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 hover:shadow-md transition"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ====================== RIGHT: CENTERED PNG ====================== */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-300 p-8">
        <div className="relative w-full max-w-md lg:max-w-lg text-center">
          <img
            src={loginBg}
            alt="Menu Mate Illustration"
            className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
