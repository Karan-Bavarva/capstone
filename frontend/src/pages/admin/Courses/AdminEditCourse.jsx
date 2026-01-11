import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../../context/CourseContext";
import Page from "../../../components/layout/common/Page";

const AdminEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchCourseById, updateCourse, deleteLecture } = CourseData();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingLectureId, setDeletingLectureId] = useState(null);

  /* ===============================
     Helpers
  =============================== */
  const normalizeId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value._id) return value._id;
    return "";
  };

  /* ===============================
     Load Course
  =============================== */
  const loadCourse = async () => {
    setLoading(true);
    try {
      const data = await fetchCourseById(id);
      if (data) {
        setCourse({
          ...data,
          tutor: normalizeId(data.tutor),
          published: Boolean(data.published),
          is_featured: Boolean(data.is_featured),
          lectures: Array.isArray(data.lectures)
            ? data.lectures.map((l) => ({ ...l, _id: normalizeId(l._id) }))
            : [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  /* ===============================
     Form Handlers
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload = {
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        // price: course.price, // Commented out - all courses are free
        status: course.status,
        published: course.published,
        is_featured: course.is_featured,
        tutor: course.tutor,
      };

      await updateCourse(id, payload);
      alert("Course updated successfully!");
      navigate("/admin/courses");
    } catch (err) {
      alert("Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  if (loading || !course) {
    return (
      <p className="text-center py-20 text-gray-500 font-semibold">
        Loading course data...
      </p>
    );
  }

  return (
    <Page
      title="Edit Course"
      actions={
        <button
          onClick={() => navigate("/admin/courses")}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          ← Back
        </button>
      }
      card={false}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-10 w-full"
      >
        {/* Title + Category */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="border rounded-md px-4 py-2"
            required
          />

          <input
            name="category"
            value={course.category || ""}
            onChange={handleChange}
            placeholder="Category"
            className="border rounded-md px-4 py-2"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          rows={4}
          value={course.description}
          onChange={handleChange}
          placeholder="Course description"
          className="w-full border rounded-md px-4 py-2 mb-6"
          required
        />

        {/* Level / Status (Price commented out) */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          {/* Commented out - all courses are free for now */}
          {/* <input
            type="number"
            name="price"
            value={course.price}
            onChange={handleChange}
            placeholder="Price"
            className="border rounded-md px-4 py-2"
          /> */}

          <select
            name="status"
            value={course.status}
            onChange={handleChange}
            className="border rounded-md px-4 py-2"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Published */}
          <Toggle
            label="Published"
            description="Visible to students"
            enabled={course.published}
            onToggle={() =>
              setCourse((p) => ({ ...p, published: !p.published }))
            }
            activeColor="bg-green-500"
          />

          {/* Featured */}
          <Toggle
            label="Featured"
            description="Show on homepage"
            enabled={course.is_featured}
            onToggle={() =>
              setCourse((p) => ({ ...p, is_featured: !p.is_featured }))
            }
            activeColor="bg-indigo-600"
          />
        </div>

        <button
          disabled={updating}
          className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-green-600 to-green-500"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Page>
  );
};

/* ===============================
   Toggle Component
=============================== */
const Toggle = ({ label, description, enabled, onToggle, activeColor }) => (
  <div className="flex items-center justify-between border rounded-lg px-4 py-3">
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>

    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        enabled ? activeColor : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

export default AdminEditCourse;
