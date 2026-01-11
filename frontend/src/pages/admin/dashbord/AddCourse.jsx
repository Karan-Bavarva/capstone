// src/components/course/AddCourse.jsx
import React, { useState } from "react";
import { server } from "../../../utils/config";
import axios from "axios";
import toast from "react-hot-toast";

const AddCourse = () => {
  const [title, setTitle] = useState("");
  // const [price, setPrice] = useState(""); // Commented out - all courses are free
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [lectures, setLectures] = useState([{ title: "", file: null }]);
  const [loading, setLoading] = useState(false);

  const addLectureRow = () => setLectures([...lectures, { title: "", file: null }]);
  const removeLectureRow = (index) => setLectures(lectures.filter((_, i) => i !== index));
  const handleLectureChange = (index, key, value) => {
    const updated = [...lectures];
    updated[index][key] = value;
    setLectures(updated);
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      // formData.append("price", price); // Commented out - all courses are free
      formData.append("duration", duration);
      formData.append("description", description);
      if (image) formData.append("thumbnail", image);

      lectures.forEach((lec, idx) => {
        if (lec.file?.size > 100 * 1024 * 1024) {
          alert(`Lecture ${idx + 1} exceeds 100 MB`);
          setLoading(false);
          return;
        }
        formData.append("lectures", lec.file);
        formData.append("lectureTitles", lec.title);
      });

      const token = localStorage.getItem("accessToken");
      await axios.post(`${server}/api/courses`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      toast.success("Course added successfully!");
      setTitle(""); /* setPrice(""); */ setDuration(""); setDescription(""); setImage(null);
      setLectures([{ title: "", file: null }]);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submitCourse} className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto space-y-4">
      <h3 className="text-2xl font-semibold mb-4">Add New Course</h3>

      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
      {/* Commented out - all courses are free for now */}
      {/* <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" /> */}
      <input type="number" placeholder="Duration (weeks)" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={4} />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full px-3 py-2 border rounded-lg" />

      <div>
        <h4 className="font-medium mb-2">Lectures</h4>
        {lectures.map((lec, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2">
            <input type="text" placeholder={`Lecture ${index + 1} Title`} value={lec.title} onChange={e => handleLectureChange(index, "title", e.target.value)} className="px-3 py-2 border rounded-lg" required />
            <input type="file" accept="video/*" onChange={e => handleLectureChange(index, "file", e.target.files[0])} className="px-3 py-2 border rounded-lg" required />
            <button type="button" onClick={() => removeLectureRow(index)} className="bg-red-500 text-white px-2 rounded-lg">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addLectureRow} className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">Add Lecture</button>
      </div>

      <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-3 rounded-lg w-full">
        {loading ? "Adding..." : "Add Course"}
      </button>
    </form>
  );
};

export default AddCourse;
