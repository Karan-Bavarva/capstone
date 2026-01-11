import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LectureData } from "../../../context/LectureContext";
import LectureForm from "../../../components/ui/course/LectureForm";

const EditLecture = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { lectures, updateLecture, fetchLectures, loading } = LectureData();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchLectures(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (lectures.length > 0 && lectureId) {
      const lecture = lectures.find((lec) => lec._id === lectureId);
      if (lecture) {
        setInitialData(lecture);
      } else {
        // lecture not found, redirect back
        navigate(`/tutor/lectures/${courseId}`);
      }
    }
  }, [lectures, lectureId]);

  const handleSubmit = async (data) => {
    await updateLecture(courseId, lectureId, data);
    navigate(`/tutor/lectures/${courseId}`);
  };

  if (loading || !initialData) {
    return <p className="p-6">Loading lecture data...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Lecture</h1>
      <LectureForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/tutor/lectures/${courseId}`)}
      />
    </div>
  );
};

export default EditLecture;
