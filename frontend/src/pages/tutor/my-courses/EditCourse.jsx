import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CourseForm from "../../../components/ui/course/CourseForm";
import LectureList from "../../../components/ui/course/LectureList";
import AddLectureModal from "../../../components/ui/course/LectureModal";
import DeleteLectureModal from "../../../components/ui/course/DeleteLectureModal"; 

import { CourseData } from "../../../context/CourseContext";
import Page from "../../../components/layout/common/Page";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { course, fetchCourseById, updateCourse, loading,deleteLecture } = CourseData();

  const [isLoaded, setIsLoaded] = useState(false);
  const [openLectureModal, setOpenLectureModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [lectureToDelete, setLectureToDelete] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCourseById(id);

      if (!data) {
        toast.error("Course not found");
        navigate("/tutor/my-courses");
        return;
      }

      setIsLoaded(true);
    };

    load();
  }, [id]);

  const handleSubmit = async (formData) => {
    const ok = await updateCourse(id, formData);
    if (ok) {
      toast.success("Course updated");
      navigate("/tutor/my-courses");
    }
  };

  const handleConfirmDeleteLecture = async (lecture) => {
  if (!lecture) return;
  await deleteLecture(id, lecture._id);
  setLectureToDelete(null);
  await fetchCourseById(id);
};

  if (!isLoaded) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading course...
      </p>
    );
  }

  if (!course) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Course not found.
      </p>
    );
  }

  return (
    <Page
      title="Edit Course"
      actions={
        <button
          onClick={() => navigate("/tutor/my-courses")}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
        >
          ← Back
        </button>
      }
      className="max-w-[1600px]"
    >
      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT — COURSE FORM */}
        <div className="xl:col-span-2 bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Course Information
          </h2>

          <CourseForm
            initialData={course}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* RIGHT — LECTURES */}
        <div className="bg-white shadow rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Lectures
            </h2>

            <button
              onClick={() => {
                setSelectedLecture(null);
                setOpenLectureModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
            >
              + Add Lecture
            </button>
          </div>

          <LectureList
            lectures={course.lectures || []}
            onEdit={(lecture) => {
              setSelectedLecture(lecture);
              setOpenLectureModal(true);
            }}
            onDelete={(lecture) => {
              setLectureToDelete(lecture); 
            }}
          />
        </div>
      </div>

      {openLectureModal && (
        <AddLectureModal
          courseId={id}
          lecture={selectedLecture}
          onClose={() => {
            setOpenLectureModal(false);
            setSelectedLecture(null);
          }}
        />
      )}

      {lectureToDelete && (
        <DeleteLectureModal
          lecture={lectureToDelete}
          onClose={() => setLectureToDelete(null)}
          onConfirm={handleConfirmDeleteLecture}
        />
      )}
    </Page>
  );
};

export default EditCourse;
