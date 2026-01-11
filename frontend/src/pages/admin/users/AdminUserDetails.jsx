import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminUserData } from "../../../context/AdminUserContext";
import { ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react";
import { server } from "../../../utils/config";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getUserById, approveKyc, rejectKyc } = AdminUserData();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await getUserById(id);
      if (res) {
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // Update role if changed
      if (form.role !== user.role) {
        await axiosInstance.put(`/api/admin/users/${id}/role`, {
          role: form.role,
        });
      }

      // Update status if changed
      if (form.status !== user.status) {
        await axiosInstance.put(`/api/admin/users/${id}/status`, {
          status: form.status,
        });
      }

      toast.success("User updated successfully");

      // Refetch user data
      const res = await getUserById(id);
      if (res) {
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const isPdf = (file) => file?.toLowerCase().endsWith(".pdf");

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-6">User Details</h1>

      {loading ? (
        <p className="text-gray-500">Loading user details...</p>
      ) : !user ? (
        <p className="text-gray-600">User not found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className={`mt-6 px-5 py-2 rounded-lg flex items-center gap-2 ${
                updating
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {updating ? (
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
                  <span>Updating...</span>
                </>
              ) : (
                "Update User"
              )}
            </button>
          </div>

          {user.role === "TUTOR" && (
            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-xl font-semibold mb-4">KYC Documents</h2>

              {!user.kyc || !user.kyc.documents?.length ? (
                <p className="text-gray-500 text-sm">No KYC uploaded.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {user.kyc.documents.map((doc) => (
                      <div key={doc._id} className="border rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {doc.type.replace("_", " ")}
                        </p>

                        <a
                          href={`${server}${doc.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 underline"
                        >
                          <FileText /> View Document
                        </a>

                        <p className="text-xs text-gray-400 mt-2">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {user.kyc.status === "PENDING" ? (
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={async () => {
                          const res = await approveKyc(id);
                          if (res?.data) {
                            setUser((prev) => ({ ...prev, kyc: res.data.kyc }));
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle size={20} /> Approve KYC
                      </button>

                      <button
                        onClick={async () => {
                          const res = await rejectKyc(id);
                          if (res?.data) {
                            setUser((prev) => ({ ...prev, kyc: res.data.kyc }));
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle size={20} /> Reject KYC
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm font-semibold">
                      KYC Status:{" "}
                      <span
                        className={
                          user.kyc.status === "APPROVED"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {user.kyc.status}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
