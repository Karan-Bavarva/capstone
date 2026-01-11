
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const statusColors = {
  APPROVED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
};

const TutorCourseDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL || process.env.REACT_APP_SERVER}/api/courses/${id}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setDetails(data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="loader" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  if (!details)
    return (
      <div className="p-8 text-center text-red-500">No details found.</div>
    );

  const { course, enrolledUsers, registeredUsers, totalWatchTime } = details;

  // For tutors, fetch also blocked users (optional: you may want to show them differently)
  // We'll assume the API returns all users (blocked and unblocked) for tutors
  // If not, you may need to fetch separately or adjust backend

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Course Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-4">
          <div className="font-medium">Registered Users</div>
          <div className="text-2xl">{registeredUsers !== undefined ? registeredUsers : enrolledUsers.length}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="font-medium">Total Watch Time</div>
          <div className="text-2xl">{totalWatchTime !== undefined ? totalWatchTime : 0} min</div>
        </div>
      </div>
      {/* Course Card */}
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden mb-8">
        {course.image && (
          <div className="md:w-1/3 w-full h-56 md:h-auto bg-gray-100 flex items-center justify-center">
            <img
              src={course.image.startsWith('http') ? course.image : `${import.meta.env.VITE_SERVER_URL || process.env.REACT_APP_SERVER}${course.image}`}
              alt={course.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-2">{course.title}</h1>
            <p className="mb-3 text-gray-700">{course.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {course.category}
              </span>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                {course.level}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[course.status] || 'bg-gray-100 text-gray-700'}`}>{course.status}</span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {course.published ? 'Published' : 'Unpublished'}
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500 mb-2">
              <span><strong>Total Students:</strong> {enrolledUsers.length}</span>
              <span><strong>Total Duration:</strong> {course.totalDuration || 0} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Users Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1E3A8A]">Enrolled Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-center">Progress (%)</th>
                <th className="px-4 py-2 border-b text-center">Completed Lectures</th>
                <th className="px-4 py-2 border-b text-center">Last Watched</th>
                <th className="px-4 py-2 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users enrolled yet.
                  </td>
                </tr>
              )}
              {enrolledUsers.map((user) => (
                <tr key={user.student._id} className={`hover:bg-gray-50 ${user.isBlocked ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-2 border-b">{user.student.name}</td>
                  <td className="px-4 py-2 border-b">{user.student.email}</td>
                  <td className="px-4 py-2 border-b text-center">{user.progressPercent}</td>
                  <td className="px-4 py-2 border-b text-center">{user.completedLectures}</td>
                  <td className="px-4 py-2 border-b text-center">{user.lastWatchedAt ? new Date(user.lastWatchedAt).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2 border-b text-center">
                    {!user.isBlocked ? (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        onClick={async () => {
                          if (window.confirm(`Block ${user.student.name} from this course?`)) {
                            try {
                              const token = localStorage.getItem("accessToken");
                              const res = await fetch(
                                `${import.meta.env.VITE_SERVER_URL || process.env.REACT_APP_SERVER}/api/enrollments/${course._id}/students/${user.student._id}`,
                                {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              if (!res.ok) throw new Error("Failed to block student");
                              toast.success("Student blocked successfully");
                              setDetails((prev) => ({
                                ...prev,
                                enrolledUsers: prev.enrolledUsers.map((u) =>
                                  u.student._id === user.student._id ? { ...u, isBlocked: true } : u
                                ),
                              }));
                            } catch (err) {
                              toast.error(err.message);
                            }
                          }
                        }}
                      >
                        Stop Learning
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={async () => {
                          if (window.confirm(`Resume learning for ${user.student.name}?`)) {
                            try {
                              const token = localStorage.getItem("accessToken");
                              const res = await fetch(
                                `${import.meta.env.VITE_SERVER_URL || process.env.REACT_APP_SERVER}/api/enrollments/${course._id}/students/${user.student._id}/unblock`,
                                {
                                  method: "PATCH",
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              if (!res.ok) throw new Error("Failed to resume learning");
                              toast.success("Student unblocked successfully");
                              setDetails((prev) => ({
                                ...prev,
                                enrolledUsers: prev.enrolledUsers.map((u) =>
                                  u.student._id === user.student._id ? { ...u, isBlocked: false } : u
                                ),
                              }));
                            } catch (err) {
                              toast.error(err.message);
                            }
                          }
                        }}
                      >
                        Resume Learning
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorCourseDetails;
