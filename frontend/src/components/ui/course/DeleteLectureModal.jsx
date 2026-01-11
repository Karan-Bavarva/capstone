import React from "react";
import { AlertTriangle } from "lucide-react";

const DeleteLectureModal = ({ lecture, onClose, onConfirm }) => {
  if (!lecture) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" />
          <h2 className="text-xl font-bold text-gray-800">Delete Lecture</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <b>{lecture.title}</b>? This action
          cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(lecture)}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLectureModal;
