import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserData } from "../../context/UserContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = UserData();
  const location = useLocation();

  if (loading) {
    // you can replace with a nice loader component
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Restrict tutors with KYC_PENDING status to only access profile page
  if (
    user.role === "TUTOR" &&
    user.status === "KYC_PENDING" &&
    location.pathname !== "/account/profile"
  ) {
    return <Navigate to="/account/profile" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // user is logged in but not allowed
    return <Navigate to="/" replace />;
  }

  return children;
}
