import React from "react";
import "./account.css";
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser(null);
    setIsAuth(false);
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const openDashboard = () => {
    if (!user || !user.role) return;

    const role = user.role.toLowerCase();

    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "tutor") navigate("/tutor/dashboard");
    else navigate(`/${user._id}/dashboard`);
  };

  return (
    <div className="account-page flex items-center justify-center min-h-screen bg-gray-50">
      {user && (
        <div className="account-card bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="account-header flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">👤 My Profile</h2>
            <span
              className={`role-badge px-3 py-1 rounded-full text-sm font-semibold ${
                user.role?.toLowerCase() === "admin"
                  ? "bg-red-100 text-red-700"
                  : user.role?.toLowerCase() === "tutor"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="account-body space-y-3 mb-6">
            <div className="info-item">
              <strong className="text-gray-600">Name:</strong>{" "}
              <span className="text-gray-800">{user.name}</span>
            </div>
            <div className="info-item">
              <strong className="text-gray-600">Email:</strong>{" "}
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="info-item">
              <strong className="text-gray-600">Status:</strong>{" "}
              <span
                className={`status-badge px-2 py-0.5 rounded-md text-sm ${
                  user.status?.toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          <div className="account-actions flex flex-col gap-3">
            <button
              onClick={openDashboard}
              className="btn flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
            >
              <MdDashboard />
              Go to Dashboard
            </button>

            <button
              onClick={logoutHandler}
              className="btn flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
