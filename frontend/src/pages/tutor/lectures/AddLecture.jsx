import React, { useState } from "react";
import LectureForm from "../../../components/ui/course/LectureForm";
import { LectureData } from "../../../context/LectureContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddLecture = () => {
  const { courseId } = useParams();
  const { addLecture } = LectureData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      duration: form.duration, // e.g. "00:12"
      video: form.video, // file object or null
    };

    const ok = await addOrUpdateLecture(
      courseId,
      lecture ? lecture._id : null,
      payload
    );
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Lecture</h1>
      <LectureForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddLecture;
