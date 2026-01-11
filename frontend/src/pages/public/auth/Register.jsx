import React, { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../../context/UserContext";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userType, setUserType] = useState("STUDENT");

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!name.trim()) temp.name = "Full name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) temp.email = "Email is required";
    else if (!emailRegex.test(email)) temp.email = "Enter a valid email address";

    if (!password) temp.password = "Password is required";
    else if (password.length < 6)
      temp.password = "Password must be at least 6 characters long";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    await registerUser(name, email, password, userType, navigate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-fade-in shadow-2xl border border-[#1E3A8A]/20">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#0D9488] transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-6 text-center">
          Join LearnHub
        </h2>

        {/* 👇 USER TYPE TABS */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setUserType("STUDENT")}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${
              userType === "STUDENT"
                ? "bg-[#0D9488] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            User
          </button>

          <button
            onClick={() => setUserType("TUTOR")}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${
              userType === "TUTOR"
                ? "bg-[#0D9488] text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tutor
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition 
                ${errors.name ? "border-red-500" : "border-[#1E3A8A]/30"}`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition
                ${errors.email ? "border-red-500" : "border-[#1E3A8A]/30"}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition
                ${errors.password ? "border-red-500" : "border-[#1E3A8A]/30"}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white py-3 rounded-xl font-semibold hover:shadow-xl transform transition-all duration-200 ${
              !btnLoading && "hover:scale-105"
            }`}
          >
            {btnLoading ? "Please Wait..." : `Sign up`}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0D9488] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
