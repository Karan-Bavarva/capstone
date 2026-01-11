import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import Page from "../../../components/layout/common/Page";

export default function AdminEditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    // price: "", // Commented out - all courses are free
    published: false,
  });

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.put(`/api/admin/courses/${id}`, course);
      alert("Course updated successfully");
      navigate("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await axiosInstance.post(`/api/admin/courses/${id}/publish`);
      alert("Course published successfully");
      fetchCourse();
    } catch (error) {
      console.error(error);
      alert("Failed to publish course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <Page title="Edit Course" subtitle="Update course details and publish when ready" className="max-w-4xl">
      <form onSubmit={handleUpdate} className="space-y-6">

        <div>
          <label className="block text-sm font-medium mb-1">
            Course Title
          </label>
          <input
            type="text"
            value={course.title}
            onChange={(e) =>
              setCourse({ ...course, title: e.target.value })
            }
            className="w-full rounded border px-4 py-2"
            placeholder="Enter course title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
            className="w-full rounded border px-4 py-2"
            placeholder="Course description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <input
            type="text"
            value={course.category}
            onChange={(e) =>
              setCourse({ ...course, category: e.target.value })
            }
            className="w-full rounded border px-4 py-2"
            placeholder="Development, Marketing, Design"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Level
          </label>
          <select
            value={course.level}
            onChange={(e) =>
              setCourse({ ...course, level: e.target.value })
            }
            className="w-full rounded border px-4 py-2"
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Commented out - all courses are free for now
        <div>
          <label className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="number"
            value={course.price}
            onChange={(e) =>
              setCourse({ ...course, price: e.target.value })
            }
            className="w-full rounded border px-4 py-2"
            min="0"
            placeholder="0 for free"
          />
        </div>
        */}

        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Update Course"}
          </button>

          {!course.published && (
            <button
              type="button"
              onClick={handlePublish}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Approve & Publish
            </button>
          )}

          <Link
            to="/admin/courses"
            className="border px-6 py-2 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Page>
  );
}
