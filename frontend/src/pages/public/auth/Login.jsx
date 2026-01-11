import React, { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../../context/UserContext";
import { CourseData } from "../../../context/CourseContext";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const { fetchMyCourse } = CourseData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password, navigate);
    if (res?.status === true) {
      setShowLogin(false);
    }
  };

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-[#1E3A8A]/20">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#0D9488] transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-[#1E3A8A]/30 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-[#1E3A8A]/30 rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm text-[#0D9488] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white py-3 rounded-xl font-semibold hover:shadow-xl transform transition-all duration-200 ${
              !btnLoading && "hover:scale-105"
            }`}
          >
            {btnLoading ? "Please Wait..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#0D9488] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
