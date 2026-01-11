import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCourseRating } from '../../../utils/reviewApi';

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};


const CourseList = ({ courses, loading, onDelete }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [ratings, setRatings] = useState({}); // { [courseId]: { avgRating, reviews } }
  const navigate = useNavigate();

  useEffect(() => {
    if (!courses) return;
    const fetchRatings = async () => {
      const results = {};
      await Promise.all(
        courses.map(async (course) => {
          try {
            const data = await getCourseRating(course._id);
            results[course._id] = data;
          } catch {
            results[course._id] = { avgRating: 0, reviews: [] };
          }
        })
      );
      setRatings(results);
    };
    fetchRatings();
  }, [courses]);

  if (loading) return <p className="text-center py-10 text-gray-600">Loading courses...</p>;

  if (!courses?.length)
    return <p className="text-center py-10 text-gray-600">No courses available.</p>;

  // Unique categories for filter dropdown (ignore falsy values)
  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];
  // Unique statuses for filter dropdown (ignore falsy values)
  const statuses = [...new Set(courses.map((c) => c.status).filter(Boolean))];

  // Filter courses based on search, category and status
  const filteredCourses = courses.filter((course) => {
    const title = course.title || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? course.category === category : true;
    const matchesStatus = status ? course.status === status : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setDeletingId(courseId);
      try {
        await onDelete(courseId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Add Course Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900"></h2>
        <button
          onClick={() => navigate("/tutor/my-courses/add")}
          className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Add New Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by course title..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((stat) => (
            <option key={stat} value={stat}>
              {stat ? stat.charAt(0) + stat.slice(1).toLowerCase() : "Unknown"}
            </option>
          ))}
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 col-span-full mt-10">
            No courses match your filter.
          </p>
        )}

        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="border rounded-2xl p-8 pb-20 shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col min-h-[420px] relative group"
            style={{ minHeight: 420 }}
          >

            {/* Title, Status, and Rating */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">{course.title}</h3>
                {/* Rating stars */}
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${ratings[course._id]?.avgRating >= i + 1 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{ratings[course._id]?.avgRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full uppercase shadow-sm ${
                  STATUS_COLORS[course.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {course.status}
              </span>
            </div>

            {/* Category Tag */}
            <span className="inline-block mb-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium w-max">
              {course.category}
            </span>

            {/* Description */}
            <p className="text-gray-700 mt-2 mb-4 line-clamp-3 flex-grow text-base">{course.description}</p>

            {/* Tutor */}
            <p className="text-sm mb-2 text-gray-500">
              <strong className="text-gray-700">Tutor:</strong> {course.tutor?.name || "Unknown"}
            </p>

            {/* Buttons */}
            <div className="absolute bottom-6 left-0 w-full flex flex-wrap gap-3 justify-end px-8">
              <Link
                to={`/tutor/my-courses/details/${course._id}`}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold shadow transition"
              >
                View
              </Link>
              <Link
                to={`/tutor/my-courses/edit/${course._id}`}
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-semibold shadow transition"
              >
                Edit
              </Link>
              <Link
                to={`/course/${course._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold shadow transition"
                style={{ minWidth: 90, textAlign: 'center' }}
              >
                Preview
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                disabled={deletingId === course._id}
                className={`px-5 py-2 rounded-lg text-white text-sm font-semibold shadow transition ${
                  deletingId === course._id
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                style={{ minWidth: 90 }}
              >
                {deletingId === course._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
