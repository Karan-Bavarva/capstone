// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance.js";
import { server } from "../utils/config.js";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const normalizeResponse = (raw) => {
    if (!raw) return null;

    if (raw.user || raw.access || raw.refresh) {
      return {
        user: raw.user,
        access: raw.access,
        refresh: raw.refresh,
        meta: raw.meta || null,
      };
    }
    const maybeData = raw.data ?? raw;
    if (maybeData.meta && maybeData.data) {
      const inner = maybeData.data;
      return {
        user: inner.user,
        access: inner.access,
        refresh: inner.refresh,
        meta: maybeData.meta,
      };
    }
    if (maybeData.user || maybeData.access || maybeData.refresh) {
      return {
        user: maybeData.user,
        access: maybeData.access,
        refresh: maybeData.refresh,
        meta: maybeData.meta || null,
      };
    }

    return {
      user: raw.user ?? null,
      access: raw.access ?? null,
      refresh: raw.refresh ?? null,
      meta: raw.meta ?? null,
    };
  };

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);

    try {
      // Use your axiosInstance (it may already unwrap). We still capture full response for debugging.
      const raw = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      const normalized = normalizeResponse(raw);
      if (normalized?.meta && normalized.meta.status === false) {
        toast.error(normalized.meta.message || "Login failed");
        setIsAuth(false);
        return;
      }
      if (!normalized?.access || !normalized?.refresh || !normalized?.user) {
        toast.error("Invalid login response from server");
        setIsAuth(false);
        return;
      }
      toast.success("Login successful!");
      localStorage.setItem("accessToken", normalized.access);
      localStorage.setItem("refreshToken", normalized.refresh);
      localStorage.setItem("user", JSON.stringify(normalized.user));

      setUser(normalized.user);
      setIsAuth(true);

      // Redirect based on role
      const role = (normalized.user.role || "").toUpperCase();
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "TUTOR") navigate("/tutor/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.meta?.message ||
        err?.response?.data?.message ||
        "Login failed";
      toast.error(message);
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  }


  async function registerUser(name, email, password, userType, navigate) {
    setBtnLoading(true);

    try {
      const raw = await axiosInstance.post("/api/auth/signup", {
        name,
        email,
        password,
        userType,
      });

      console.log("Signup raw response:", raw);

      const meta = raw?.meta || raw?.data?.meta;
      const userData = raw?.data || raw?.data?.data;

      if (meta?.status === false) {
        toast.error(meta.message || "Registration failed");
        return;
      }

      // Success
      toast.success(meta?.message || "Signup successful");

      // If backend returns activation token?
      if (raw?.activationToken) {
        localStorage.setItem("activationToken", raw.activationToken);
      }

      navigate("/verify-otp"); // or login if that's flow
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      const message =
        err?.response?.data?.meta?.message ||
        err?.message ||
        "Registration failed";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  }


  async function fetchUser() {
    const token = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) {
      setLoading(false);
      return;
    }

    try {
      const raw = await axiosInstance.get("/api/auth/me");
      const data = raw?.user ?? raw?.data?.user ?? raw?.data ?? raw;
      const parsedUser = data?.user ?? JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuth(true);
    } catch (err) {
      console.error("FETCH USER ERROR:", err);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  function logoutUser() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("activationToken");
    setUser(null);
    setIsAuth(false);
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (
      token &&
      savedUser &&
      savedUser !== "undefined" &&
      savedUser !== "null"
    ) {
      setUser(JSON.parse(savedUser));
      setIsAuth(true);
    }
    fetchUser();
  }, []);

  async function updateProfile(formData) {
    setBtnLoading(true);
    try {
      const raw = await axiosInstance.post(
        "/api/auth/update-profile",
        formData
      );
      const updatedUser = raw?.data;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success(raw?.meta?.message || "Profile updated successfully");
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.meta?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Profile update failed";
      toast.error(errorMessage);
      return null;
    } finally {
      setBtnLoading(false);
    }
  }


async function updateAvatar(file) {
  setBtnLoading(true);

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const raw = await axiosInstance.post(
      "/api/auth/update-avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const updatedUser = raw?.data;

    if (!updatedUser) {
      toast.error("Invalid avatar response");
      return;
    }
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Avatar updated successfully");
  } catch (err) {
    const message =
      err?.response?.data?.meta?.message ||
      err?.response?.data?.message ||
      err?.message ||
      "Avatar update failed";

    toast.error(message);
  } finally {
    setBtnLoading(false);
  }
}


  async function updatePassword(oldPassword, newPassword) {
    setBtnLoading(true);
    try {
      const raw = await axiosInstance.post("/api/auth/update-password", {
        currentPassword: oldPassword,
        newPassword,
      });

      toast.success(raw?.meta?.message || "Password updated successfully");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.meta?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Password update failed";
      toast.error(errorMessage);
    } finally {
      setBtnLoading(false);
    }
  }

  // Add this inside UserContextProvider
  async function uploadKyc(userId, files, types) {
    if (!files || files.length === 0) {
      toast.error("No files selected for upload");
      return { status: false, message: "No files selected" };
    }

    // Validate file types
    for (let file of files) {
      if (!file || !file.type) {
        toast.error("Invalid file selected");
        return { status: false, message: "Invalid file selected" };
      }
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      if (!isImage && !isPdf) {
        toast.error("Only PDF or image files are allowed");
        return { status: false, message: "Invalid file type" };
      }
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));
    types.forEach((type) => formData.append("types[]", type));

    try {
      const res = await axiosInstance.post(`/api/auth/kyc/upload`, formData);

      if (res?.meta?.status) {
        toast.success(res.meta.message || "KYC uploaded successfully");

        // --- NEW: update user state ---
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        return { status: true, message: res.meta.message };
      } else {
        toast.error(res?.meta?.message || "KYC upload failed");
        return { status: false, message: res?.meta?.message };
      }
    } catch (err) {
      const message =
        err?.response?.data?.meta?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "KYC upload failed";
      toast.error(message);
      return { status: false, message };
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        btnLoading,
        loginUser,
        logoutUser,
        registerUser,
        updateProfile,
        updateAvatar,
        updatePassword,
        uploadKyc,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
