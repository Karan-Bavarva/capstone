import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const LectureList = ({ lectures = [], onEdit, onDelete }) => {
  if (!lectures.length) {
    return (
      <p className="text-gray-500 text-sm">
        No lectures available. Click <b>Add Lecture</b> to get started.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {lectures.map((lec, index) => (
        <div
          key={lec._id}
          className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition"
        >
          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {index + 1}. {lec.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Duration: {lec.duration || "—"} • Preview:{" "}
              {lec.isPreview ? "Yes" : "No"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(lec)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(lec)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LectureList;
