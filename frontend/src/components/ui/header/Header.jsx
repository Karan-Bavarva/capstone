import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../../context/UserContext";
import { BookOpen, Menu, X } from "lucide-react";
import ThemeToggleButton from "../../common/ThemeToggleButton";
import NotificationDropdown from "../../common/NotificationDropdown";
import UserDropdown from "../../common/UserDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuth, user } = UserData();

  const goToDashboard = () => {
    if (!user) return;

    if (user.role === "ADMIN") navigate("/admin/dashboard");
    else if (user.role === "TUTOR") navigate("/tutor/dashboard");
    else navigate("/student/dashboard");
  };

  return (
    <nav
      className="shadow-md sticky top-0 z-40 text-white"
      style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #0D9488 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white drop-shadow">
              EduPlatform
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/courses" className="text-white hover:text-white transition">
              Courses
            </a>
            <a href="#about" className="text-white hover:text-white transition">
              About Us
            </a>
            <a href="#contact" className="text-white hover:text-white transition">
              Contact
            </a>

            {!isAuth ? (
              <>
                <a
                  href="/login"
                  className="text-white font-semibold hover:text-white transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={goToDashboard}
                  className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg text-center"
                >
                  My Dashboard
                </button>
                {/* <ThemeToggleButton /> */}
                {/* <NotificationDropdown /> */}
                {/* <UserDropdown /> */}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20 text-white">
          <div className="px-4 py-4 space-y-3">
            <a href="/courses" className="block text-white">
              Courses
            </a>
            <a href="/about" className="block text-white">
              About
            </a>
            <a href="#contact" className="block text-white">
              Contact
            </a>

            {!isAuth ? (
              <>
                <a href="/login" className="block text-white font-semibold">
                  Login
                </a>
                <a
                  href="/register"
                  className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg text-center"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <button
                onClick={goToDashboard}
                className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg text-center"
              >
                My Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
