import { useState } from "react";
import LectureModal from "./LectureModal";
import { server } from "../../../utils/config";
import { Plus, Video, Pencil } from "lucide-react";

const EditCourseLectures = ({ course, refreshCourse }) => {
  const [open, setOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);

  const closeModal = () => {
    setOpen(false);
    setEditingLecture(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A]">
          Course Lectures
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white px-5 py-2 rounded-lg hover:shadow-lg transition"
        >
          <Plus size={18} /> Add Lecture
        </button>
      </div>

      {/* Lectures List */}
      {course?.lectures?.length > 0 ? (
        <div className="space-y-4">
          {course.lectures.map((lec) => (
            <div
              key={lec._id}
              className="flex gap-4 p-4 border rounded-xl hover:shadow transition"
            >
              <div className="bg-[#E0F2FE] p-3 rounded-lg">
                <Video className="text-[#1E3A8A]" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {lec.title}
                  </h4>

                  <button
                    onClick={() => {
                      setEditingLecture(lec);
                      setOpen(true);
                    }}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Duration: {lec.duration || "—"}
                </p>

                {lec.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {lec.description}
                  </p>
                )}

                {lec.videoUrl && (
                  <video
                    controls
                    src={`${server}${lec.videoUrl}`}
                    className="w-full rounded-lg mt-3"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No lectures added yet. Start by adding your first lecture.
        </div>
      )}

      {/* Modal */}
      {open && (
        <LectureModal
          initialData={editingLecture}
          onClose={closeModal}
          onSave={(data) => {
            console.log("Lecture data:", data); // connect backend later
            closeModal();
            refreshCourse?.();
          }}
        />
      )}
    </div>
  );
};

export default EditCourseLectures;
