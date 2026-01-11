import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { AdminUserData } from "../../../context/AdminUserContext";
import { useNavigate } from "react-router-dom";
import { UserData } from '../../../context/UserContext';
import Page from "../../../components/layout/common/Page";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = UserData() || {};
  const { fetchAllUsers, approveUser, rejectUser, deleteUser } = AdminUserData();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Fetch users
  useEffect(() => {
    const fetch = async () => {
      setLoadingUsers(true);
      const res = await fetchAllUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });
      if (res) {
        setUsers(res.data || []);
        setPagination(res.meta?.pagination || { totalPages: 1 });
      }
      setLoadingUsers(false);
    };
    fetch();
  }, [page, limit, search, roleFilter, statusFilter]);

  // Only main admin (role: ADMIN, !isSubAdmin) can add sub-admins
  const canAddSubAdmin = user && user.role === 'ADMIN' && !user.isSubAdmin;

  // Action Handlers
  const handleApprove = async (id) => {
    try {
      const res = await approveUser(id);

      if (res?.meta?.status && res.data) {
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      }
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectUser(id);

      if (res?.meta?.status && res.data) {
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      }
    } catch (error) {
      console.error("Failed to reject user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Try again.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  // Pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    const pages = Array.from(
      { length: pagination.totalPages },
      (_, i) => i + 1
    );

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className={`flex items-center justify-center px-3 py-2 rounded-lg border ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded-lg border font-medium ${
              p === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => page < pagination.totalPages && setPage(page + 1)}
          disabled={page === pagination.totalPages}
          className={`flex items-center justify-center px-3 py-2 rounded-lg border ${
            page === pagination.totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <Page title="Admin: Manage Users">
      {canAddSubAdmin && (
        <div className="mb-4 flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            onClick={() => navigate('/admin/users/add-sub-admin')}
          >
            Add Sub-Admin
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-64 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="TUTOR">Tutor</option>
            <option value="STUDENT">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {loadingUsers ? (
        <p className="text-gray-500 text-sm">Fetching latest users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600 text-sm">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-700">{user.email}</td>
                    <td className="p-4 uppercase text-gray-600">{user.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : user.status === "APPROVED"
                            ? "bg-blue-100 text-blue-700"
                            : user.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      {user.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="p-2 text-green-600 hover:text-green-800 transition rounded-full border border-green-200"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(user._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition rounded-full border border-red-200"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleEdit(user._id)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition rounded-full border border-blue-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition rounded-full border border-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">{renderPagination()}</div>
        </>
      )}
    </Page>
  );
};

export default AdminUsers;
