import React, { useState, useEffect } from "react";
import { server } from "../../../utils/config";

const CourseForm = ({ initialData = {}, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(initialData.category || "General");
  const [level, setLevel] = useState(initialData.level || "Beginner");
  const [price, setPrice] = useState(initialData.price || 0);

  const [curriculum, setCurriculum] = useState([""]);

  useEffect(() => {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setCategory(initialData.category || "General");
    setLevel(initialData.level || "Beginner");
    setPrice(initialData.price || 0);

    if (initialData.image) {
      const isFullUrl = initialData.image.startsWith("http");
      setImageUrl(isFullUrl ? initialData.image : `${server}${initialData.image}`);
    } else {
      setImageUrl("");
    }
    setImageFile(null);

    // Handle curriculum: support array or JSON-string or comma-separated string
    if (initialData.curriculum) {
      if (Array.isArray(initialData.curriculum)) {
        setCurriculum(initialData.curriculum.length ? initialData.curriculum : [""]);
      } else if (typeof initialData.curriculum === "string") {
        try {
          // Try parsing JSON array string (e.g. '["item1","item2"]')
          const parsed = JSON.parse(initialData.curriculum);
          if (Array.isArray(parsed)) {
            setCurriculum(parsed.length ? parsed : [""]);
            return;
          }
        } catch {
          // If JSON parse fails, fallback to splitting by comma
          const rows = initialData.curriculum
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
          setCurriculum(rows.length ? rows : [""]);
          return;
        }
      } else {
        setCurriculum([""]);
      }
    } else {
      setCurriculum([""]);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean curriculum array: trim and remove empty strings
    const filteredCurriculum = curriculum
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    // Send curriculum as an array (not a joined string)
    onSubmit({
      title,
      description,
      image: imageFile || imageUrl,
      category,
      level,
      price,
      curriculum: filteredCurriculum,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const addCurriculumRow = () => {
    setCurriculum([...curriculum, ""]);
  };

  const removeCurriculumRow = (index) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  const updateCurriculum = (index, value) => {
    const updated = [...curriculum];
    updated[index] = value;
    setCurriculum(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Course Image</label>
        {imageUrl && !imageFile && (
          <img
            src={imageUrl}
            alt="Course"
            className="w-32 h-24 object-cover rounded mb-2 border"
          />
        )}
        {imageFile && (
          <p className="text-sm text-gray-600 mb-2">
            New image selected: {imageFile.name}
          </p>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* <div>
        <label className="block font-medium mb-1">Price (₹)</label>
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />
      </div> */}

      {/* Curriculum Section */}
      <div>
        <label className="block font-medium mb-2">Course Curriculum</label>

        {curriculum.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateCurriculum(index, e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder={`Curriculum point ${index + 1}`}
            />
            {curriculum.length > 1 && (
              <button
                type="button"
                onClick={() => removeCurriculumRow(index)}
                className="px-3 bg-red-500 text-white rounded"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addCurriculumRow}
          className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
        >
          + Add Point
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white py-2 rounded ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Save Course"}
      </button>
    </form>
  );
};

export default CourseForm;
