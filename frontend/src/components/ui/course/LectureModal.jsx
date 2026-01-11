import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { CourseData } from "../../../context/CourseContext";
import { server } from "../../../utils/config";

const AddLectureModal = ({ courseId, lecture, onClose }) => {
  const isEdit = Boolean(lecture);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    video: null,
    noteFiles: [],
  });

  const [existingNoteFiles, setExistingNoteFiles] = useState([]);

  const { addOrUpdateLecture, fetchCourseById } = CourseData();

  useEffect(() => {
    if (lecture) {
      setForm({
        title: lecture.title || "",
        description: lecture.description || "",
        duration: lecture.duration || "",
        video: null,
        noteFiles: [],
      });
      setExistingNoteFiles(lecture.noteFiles || []);
    } else {
      setForm({
        title: "",
        description: "",
        duration: "",
        video: null,
        noteFiles: [],
      });
      setExistingNoteFiles([]);
    }
  }, [lecture]);

  const handleNoteFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
    
    // Validate each file size
    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" exceeds 100 MB limit. Please upload a smaller file.`);
        return;
      }
    }
    
    setForm((prev) => ({
      ...prev,
      noteFiles: [...prev.noteFiles, ...newFiles],
    }));
  };

  const handleRemoveNewNoteFile = (index) => {
    setForm((prev) => {
      const newNoteFiles = [...prev.noteFiles];
      newNoteFiles.splice(index, 1);
      return { ...prev, noteFiles: newNoteFiles };
    });
  };

  const handleRemoveExistingNoteFile = (index) => {
    setExistingNoteFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    // Duration is server-calculated, so skip it.

    if (form.video) {
      formData.append("video", form.video);
    }

    // Append new note files
    form.noteFiles.forEach((file) => {
      formData.append("noteFiles", file);
    });

    // Append existing note file URLs as strings (your backend should handle this)
    existingNoteFiles.forEach((fileUrl) => {
      formData.append("existingNoteFiles", fileUrl);
    });

    // DEBUG: Log keys and values to confirm files are in FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const success = await addOrUpdateLecture(courseId, lecture?._id, formData);

    if (success) {
      await fetchCourseById(courseId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#1E3A8A]">
          {isEdit ? "Edit Lecture" : "Add New Lecture"}
        </h2>

        <input
          type="text"
          placeholder="Lecture Title"
          className="w-full border rounded-lg px-4 py-2 mb-4"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Lecture Description"
          rows={3}
          className="w-full border rounded-lg px-4 py-2 mb-4"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Duration (e.g. 12:30)"
          className="w-full border rounded-lg px-4 py-2 mb-4 bg-gray-100 cursor-not-allowed"
          value={form.duration}
          readOnly
        />

        {/* Video upload */}
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer">
            <Upload className="mb-2 text-[#1E3A8A]" />
            <p className="text-sm text-gray-600">
              {form.video ? form.video.name : "Upload Lecture Video"}
            </p>
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
                  if (file.size > MAX_VIDEO_SIZE) {
                    alert(`Video file "${file.name}" exceeds 100 MB limit. Please upload a smaller video or compress it.`);
                    e.target.value = ''; // Clear the input
                    return;
                  }
                  setForm({ ...form, video: file });
                }
              }}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Max size: 100 MB | Formats: MP4, MPEG, MOV, AVI, MKV
          </p>
        </div>

        {/* Existing note files */}
        {existingNoteFiles.length > 0 && (
          <div className="mb-2">
            <p className="font-semibold">Existing Notes:</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {existingNoteFiles.map((fileUrl, i) => (
                <li key={i} className="flex justify-between items-center">
                  <a
                    href={`${server}${fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {fileUrl.split("/").pop()}
                  </a>

                  <button
                    onClick={() => handleRemoveExistingNoteFile(i)}
                    className="text-red-500 ml-2"
                    title="Remove this note"
                    type="button"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* New notes upload */}
        <div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer">
            <Upload className="mb-2 text-[#1E3A8A]" />
            <p className="text-sm text-gray-600">
              {form.noteFiles.length > 0
                ? form.noteFiles.map((file) => file.name).join(", ")
                : "Upload Lecture Notes (PDF or files)"}
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              hidden
              onChange={handleNoteFilesChange}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Max size per file: 100 MB | Formats: PDF, DOC, DOCX, TXT
          </p>
        </div>

        {/* List newly added note files with remove option */}
        {form.noteFiles.length > 0 && (
          <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
            {form.noteFiles.map((file, i) => (
              <li key={i} className="flex justify-between items-center">
                {file.name}
                <button
                  onClick={() => handleRemoveNewNoteFile(i)}
                  className="text-red-500 ml-2"
                  title="Remove this note"
                  type="button"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white"
          >
            {isEdit ? "Update Lecture" : "Save Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLectureModal;
