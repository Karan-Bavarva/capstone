import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUserData } from "../../../context/AdminUserContext";
import { ArrowLeft } from "lucide-react";
import Page from "../../../components/layout/common/Page";

const AddSubAdmin = () => {
  const navigate = useNavigate();
  const { createSubAdmin } = AdminUserData();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password) {
      return;
    }

    setLoading(true);
    const result = await createSubAdmin(form);
    setLoading(false);

    if (result && !result.success === false) {
      navigate("/admin/users");
    }
  };

  return (
    <Page title="Add Sub-Admin">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white p-8 rounded-xl shadow-md border max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create New Sub-Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter sub-admin name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter password"
              required
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                "Create Sub-Admin"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default AddSubAdmin;
