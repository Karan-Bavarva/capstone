import { createContext, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AdminUserContext = createContext();

export const AdminUserProvider = ({ children }) => {
  async function fetchAllUsers({ page, limit, search, role, status } = {}) {
    try {
      const params = { page, limit, search, role, status };
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      const response = await axiosInstance.get("/api/admin/users", { params });
      return response;
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
      return null;
    }
  }

  async function approveUser(userId) {
    try {
      const res = await axiosInstance.put(`/api/admin/users/${userId}/status`, {
        status: "ACTIVE",
      });
      toast.success(res.data?.message || "User approved");
    } catch (err) {
      console.error("Approve user error:", err);
      toast.error("Failed to approve user");
    }
  }

  async function rejectUser(userId) {
    try {
      const res = await axiosInstance.put(`/api/admin/users/${userId}/status`, {
        status: "REJECTED",
      });
      toast.success(res.data?.message || "User rejected");
    } catch (err) {
      console.error("Reject user error:", err);
      toast.error("Failed to reject user");
    }
  }

  async function listTutors({ page, limit, search, status } = {}) {
    try {
      const params = { page, limit, search, status };
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );
      const response = await axiosInstance.get("/api/admin/tutors", { params });
      return response;
    } catch (err) {
      console.error("Error fetching tutors:", err);
      toast.error("Failed to load tutors");
      return null;
    }
  }

  async function createTutor(data) {
    try {
      const res = await axiosInstance.post("/api/admin/tutors", data);
      toast.success(res.data?.message || "Tutor created successfully");
      return res.data;
    } catch (err) {
      console.error("Error creating tutor:", err);
      toast.error(err.response?.data?.message || "Failed to create tutor");
      return { success: false, message: err.response?.data?.message };
    }
  }

  async function updateTutor(tutorId, data) {
    try {
      const res = await axiosInstance.put(`/api/admin/tutors/${tutorId}`, data);
      toast.success(res.data?.message || "Tutor updated successfully");
      return res.data;
    } catch (err) {
      console.error("Error updating tutor:", err);
      toast.error(err.response?.data?.message || "Failed to update tutor");
      return { success: false, message: err.response?.data?.message };
    }
  }

  async function deleteUser(userId) {
    try {
      const res = await axiosInstance.delete(`/api/admin/users/${userId}`);
      toast.success(res.data?.message || "User deleted successfully");
      return res.data;
    } catch (err) {
      console.error("Error deleting tutor:", err);
      toast.error(err.response?.data?.message || "Failed to delete tutor");
      return { success: false, message: err.response?.data?.message };
    }
  }

  async function getUserById(id) {
    try {
      const res = await axiosInstance.get(`/api/admin/users/${id}`);
      return res; // Keep original response style
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Failed to fetch user");
      return null;
    }
  }

  async function updateUserById(id, data) {
    try {
      const res = await axiosInstance.put(`/api/admin/users/${id}`, data);
      toast.success(res.data?.message || "User updated");
      return res;
    } catch (err) {
      console.error("Update user error:", err);
      toast.error("Failed to update user");
      return null;
    }
  }

  async function getUserKyc(id) {
    try {
      const res = await axiosInstance.get(`/api/admin/users/${id}/kyc`);
      return res;
    } catch (err) {
      console.error("KYC fetch error:", err);
      toast.error("Failed to load KYC");
      return null;
    }
  }

  async function approveKyc(id) {
    try {
      const res = await axiosInstance.post(`/api/admin/users/${id}/kyc/approve`);
      toast.success(res.data?.message || "KYC approved");
      return res;
    } catch (err) {
      console.error("KYC approve error:", err);
      toast.error("Failed to approve KYC");
      return null;
    }
  }

  async function rejectKyc(id, remark) {
    try {
      const res = await axiosInstance.post(`/api/admin/users/${id}/kyc/reject`, {
        remark,
      });
      toast.success(res.data?.message || "KYC rejected");
      return res;
    } catch (err) {
      console.error("KYC reject error:", err);
      toast.error("Failed to reject KYC");
      return null;
    }
  }

  async function createSubAdmin(data) {
    try {
      const res = await axiosInstance.post("/api/admin/sub-admins", data);
      toast.success(res.data?.message || "Sub-admin created successfully");
      return res.data;
    } catch (err) {
      console.error("Error creating sub-admin:", err);
      toast.error(err.response?.data?.message || "Failed to create sub-admin");
      return { success: false, message: err.response?.data?.message };
    }
  }

  return (
    <AdminUserContext.Provider
      value={{
        fetchAllUsers,
        approveUser,
        rejectUser,
        listTutors,
        createTutor,
        updateTutor,
        deleteUser,
        getUserById,
        updateUserById,
        getUserKyc,
        approveKyc,
        rejectKyc,
        createSubAdmin,
      }}
    >
      {children}
    </AdminUserContext.Provider>
  );
};

export const AdminUserData = () => useContext(AdminUserContext);
