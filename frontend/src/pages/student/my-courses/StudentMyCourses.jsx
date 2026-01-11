import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../../context/CourseContext";
import { Clock, Star } from "lucide-react";
import { server } from "../../../utils/config";

const StudentMyCourses = () => {
  const { myEnrollments = [], fetchMyEnrollments, loading } = CourseData();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const parseProgressPercent = (value) => {
    if (!value) return 0;
    if (value > 0 && value <= 1) return Math.round(value * 100);
    return Math.round(value);
  };

  const parseDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const extractDate = (dateObj) => {
    if (!dateObj) return null;

    if (typeof dateObj === "string") {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateObj)) {
        return parseDateDDMMYYYY(dateObj);
      }
      return new Date(dateObj);
    }

    if (typeof dateObj === "object" && dateObj["$date"]) {
      const d = dateObj["$date"];
      if (typeof d === "object" && d["$numberLong"]) {
        return new Date(parseInt(d["$numberLong"], 10));
      }
      return new Date(d);
    }

    return null;
  };

  const getEnrollmentDate = (item) => {
    if (item.enrolledAt) {
      return extractDate(item.enrolledAt);
    }
    if (item.createdAt) {
      return extractDate(item.createdAt);
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filtered = myEnrollments.filter((item) => {
    const courseTitle =
      item.courseTitle ||
      item.course?.title ||
      item.course?.name ||
      item.title ||
      "";

    return courseTitle.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div>Loading enrolled courses...</div>;
  }

  return (
    <div className="enrolled-courses p-4">
      <div className="enrolled-courses-top flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1E3A8A]">
          Enrolled Courses
        </h2>

        <input
          type="search"
          className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="enrolled-courses-main grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="no-data col-span-full text-center text-gray-500">
            No enrolled courses
          </div>
        ) : (
          filtered.map((item) => {
            const course = item.course || item || {};
            const courseTitle =
              item.courseTitle ||
              course.title ||
              course.name ||
              item.title ||
              "Course";

            const rawProgress =
              item.progressPercent ?? course.progressPercent ?? 0;
            let progressPercent = parseProgressPercent(rawProgress);
            progressPercent = Math.min(100, Math.max(0, progressPercent));

            const enrolledDate = getEnrollmentDate(item);
            const enrolledDateString = formatDate(enrolledDate);

            const imageSrc =
              course?.image && course.image.startsWith("http")
                ? course.image
                : course?.image
                ? `${server}${course.image}`
                : "https://via.placeholder.com/400x200?text=No+Image";

            return (
              <div
                key={course._id || item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all flex flex-col"
              >
                <img
                  src={imageSrc}
                  alt={courseTitle}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">
                    {courseTitle}
                  </h3>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Progress: {progressPercent}%
                    </p>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">
                    Enrolled On {enrolledDateString}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/student/my-courses/${course._id || item._id}`
                        )
                      }
                      className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default StudentMyCourses;
