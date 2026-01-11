import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LectureList from "../../../components/ui/course/LectureList";
import { LectureData } from "../../../context/LectureContext";
import toast from "react-hot-toast";

const ViewCourse = () => {
  const { id } = useParams();
  const { lectures, fetchLectures, loading, deleteLecture } = LectureData();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
        await fetchLectures(id);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await deleteLecture(id, lectureId);
      } catch (err) {
        toast.error("Failed to delete lecture");
      }
    }
  };

  if (!course) return <p>Loading course...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">{course.title}</h1>
      <p className="mb-6">{course.description}</p>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lectures</h2>
        <Link
          to={`/tutor/lectures/add/${id}`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Lecture
        </Link>
      </div>

      <LectureList
        lectures={lectures}
        loading={loading}
        onDelete={handleDeleteLecture}
      />
    </div>
  );
};

export default ViewCourse;
