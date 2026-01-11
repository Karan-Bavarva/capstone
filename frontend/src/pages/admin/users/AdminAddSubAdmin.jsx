import React, { useState } from "react";
import Page from "../../../components/layout/common/Page";
import axiosInstance from "../../../utils/axiosInstance";

const AdminAddSubAdmin = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await axiosInstance.post("/api/admin/sub-admins", form);
      if (res.data && res.data.data) {
        setSuccess("Sub-admin created successfully!");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create sub-admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add Sub-Admin">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add Sub-Admin</h2>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Sub-Admin"}
          </button>
        </form>
      </div>
    </Page>
  );
};

export default AdminAddSubAdmin;
