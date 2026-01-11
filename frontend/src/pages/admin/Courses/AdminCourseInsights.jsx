import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import Page from "../../../components/layout/common/Page";
import CourseReviewTable from "../../../components/ui/review/CourseReviewTable";

export default function AdminCourseInsights() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [courseReviews, setCourseReviews] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // Use the correct backend endpoint
        const res = await axiosInstance.get(`/api/courses/${id}/details`);
        // The backend returns { course, enrolledUsers, registeredUsers, totalWatchTime }
        setInsights(res.data);
      } catch (err) {
        setError("Failed to load course insights");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [id]);

  useEffect(() => {
    // Fetch all reviews for this course using the course-specific endpoint
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/api/courses/${id}/review`);
        // Assuming the backend returns an array of reviews
        if (Array.isArray(res.data?.reviews)) {
          setCourseReviews(res.data.reviews);
        } else if (Array.isArray(res.data)) {
          setCourseReviews(res.data);
        } else {
          setCourseReviews([]);
        }
      } catch {
        setCourseReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) return <Page title="Course Insights"><p>Loading...</p></Page>;
  if (error) return <Page title="Course Insights"><p className="text-red-600">{error}</p></Page>;
  if (!insights) return <Page title="Course Insights"><p>No insights available.</p></Page>;

  // Extract data from backend response
  const { course, registeredUsers, totalWatchTime, enrolledUsers } = insights;
  const statusColors = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <Page title="Course Insights">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Course Card */}
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          {course?.image && (
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
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A8A] mb-2">{course?.title}</h1>
              <p className="mb-3 text-gray-700">{course?.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {course?.category}
                </span>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  {course?.level}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[course?.status] || 'bg-gray-100 text-gray-700'}`}>{course?.status}</span>
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  {course?.published ? 'Published' : 'Unpublished'}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-gray-500 mb-2 flex-wrap">
                <span><strong>Registered Users:</strong> {registeredUsers}</span>
                <span><strong>Total Watch Time:</strong> {totalWatchTime} min</span>
                <span><strong>Created:</strong> {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : '-'}</span>
                <span><strong>Tutor:</strong> {course?.tutor?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        {course?.lectures && course.lectures.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-[#1E3A8A]">Lectures</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Title</th>
                    <th className="px-4 py-2 border-b text-left">Description</th>
                    <th className="px-4 py-2 border-b text-center">Duration (min)</th>
                    <th className="px-4 py-2 border-b text-center">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {course.lectures.map((lecture) => (
                    <tr key={lecture._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{lecture.title}</td>
                      <td className="px-4 py-2 border-b">{lecture.description}</td>
                      <td className="px-4 py-2 border-b text-center">{lecture.duration}</td>
                      <td className="px-4 py-2 border-b text-center">{lecture.order}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enrolled Users Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-[#1E3A8A]">Enrolled Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left">Name</th>
                  <th className="px-4 py-2 border-b text-left">Email</th>
                  <th className="px-4 py-2 border-b text-center">Progress (%)</th>
                  <th className="px-4 py-2 border-b text-center">Completed Lectures</th>
                  <th className="px-4 py-2 border-b text-center">Last Watched</th>
                  <th className="px-4 py-2 border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolledUsers && enrolledUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No users enrolled yet.
                    </td>
                  </tr>
                )}
                {enrolledUsers && enrolledUsers.map((user) => (
                  <tr key={user.student._id} className={`hover:bg-gray-50 ${user.isBlocked ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-2 border-b">{user.student.name}</td>
                    <td className="px-4 py-2 border-b">{user.student.email}</td>
                    <td className="px-4 py-2 border-b text-center">{user.progressPercent}</td>
                    <td className="px-4 py-2 border-b text-center">{user.completedLectures}</td>
                    <td className="px-4 py-2 border-b text-center">{user.lastWatchedAt ? new Date(user.lastWatchedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 border-b text-center">
                      {user.isBlocked ? (
                        <>
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs mr-2">Blocked</span>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                            onClick={async () => {
                              if (window.confirm(`Resume learning for ${user.student.name}?`)) {
                                try {
                                  await axiosInstance.patch(`/api/enrollments/${course._id}/students/${user.student._id}/unblock`);
                                  // Update UI
                                  if (typeof window !== 'undefined') window.location.reload();
                                } catch (err) {
                                  alert('Failed to resume learning');
                                }
                              }
                            }}
                          >
                            Resume Learning
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs mr-2">Active</span>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            onClick={async () => {
                              if (window.confirm(`Block ${user.student.name} from this course?`)) {
                                try {
                                  await axiosInstance.delete(`/api/enrollments/${course._id}/students/${user.student._id}`);
                                  // Update UI
                                  if (typeof window !== 'undefined') window.location.reload();
                                } catch (err) {
                                  alert('Failed to block student');
                                }
                              }
                            }}
                          >
                            Stop Learning
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Course Reviews Table (Admin) */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4 text-[#1E3A8A]">All User Reviews for this Course</h3>
          <CourseReviewTable reviews={courseReviews} />
        </div>
      </div>
    </Page>
  );
}
