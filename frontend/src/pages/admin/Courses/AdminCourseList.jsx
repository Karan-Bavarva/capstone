import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../../../components/layout/common/Page";
import { CourseData } from "../../../context/CourseContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminCourseList = () => {
  const {
    courses: contextCourses,
    fetchCourses,
    loading: contextLoading,
    totalPages,
  } = CourseData();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [published, setPublished] = useState("");

  useEffect(() => {
    fetchCourses({
      page,
      limit,
      search,
      status,
      published,
    });
  }, [page, limit, search, status, published]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className={`px-3 py-2 rounded-lg border ${
            page === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded-lg border ${
              p === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-blue-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-2 rounded-lg border ${
            page === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const actions = (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Show</label>
      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
        className="px-2 py-1 border rounded"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );

  return (
    <Page title="Admin: Manage Courses" actions={actions}>
      
      <div className="mb-6 bg-white p-5 rounded-xl shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={published}
            onChange={(e) => {
              setPublished(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatus("");
              setPublished("");
              setPage(1);
            }}
            className="bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {contextLoading ? (
        <p>Loading courses...</p>
      ) : contextCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow-md border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Tutor</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Published</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {contextCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4">{course.tutor?.name || "N/A"}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          course.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : course.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          course.published
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {course.published ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link
                          to={`/course/${course._id}`}
                          target="_blank"
                          className="text-blue-600"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/courses/edit/${course._id}`}
                          className="text-indigo-600"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/admin/courses/insights/${course._id}`}
                          className="text-green-600"
                        >
                          View Insights
                        </Link>
                      </div>
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

export default AdminCourseList;
