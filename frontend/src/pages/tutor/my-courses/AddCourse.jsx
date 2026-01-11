import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CourseForm from "../../../components/ui/course/CourseForm";
import { CourseData } from "../../../context/CourseContext";
import { UserData } from "../../../context/UserContext";
import Page from "../../../components/layout/common/Page";

const AddCourse = () => {
  const navigate = useNavigate();
  const { createCourse, loading } = CourseData();
  const { user } = UserData();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTutorInactive =
    user?.role === "TUTOR" && user?.status !== "ACTIVE";

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== null && value !== undefined) {
        // If value is array (eg. curriculum), append each item separately
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      }
    });

    const created = await createCourse(data);
    setIsSubmitting(false);

    if (created) {
      toast.success("Course created successfully!");
      navigate("/tutor/my-courses");
    } else {
      toast.error("Failed to create course.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <Page
        title="Create a New Course"
        subtitle="Build a high-quality learning experience. Courses go through a review process before being published."
        actions={
          <button
            onClick={() => navigate("/tutor/my-courses")}
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Back to Courses
          </button>
        }
        card={false}
      />

      {/* STATUS NOTICE */}
      {isTutorInactive && (
        <div className="mb-8 rounded-xl border border-yellow-300 bg-yellow-50 p-5">
          <p className="font-semibold text-yellow-800">
            ⏳ Your tutor account is under review
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            You can create courses, but publishing will be enabled after admin approval.
          </p>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
        
        {/* LEFT GUIDE PANEL */}
        <aside className="xl:col-span-1 hidden xl:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">
                Course Creation Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>✔ Use a clear, searchable title</li>
                <li>✔ Add a high-quality cover image</li>
                <li>✔ Structure lectures logically</li>
                <li>✔ Set fair pricing</li>
                <li>✔ Preview before publishing</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <p className="text-sm opacity-90">
                Our team reviews courses within 24–48 hours.
              </p>
            </div>
          </div>
        </aside>

        {/* FORM AREA */}
        <main className="xl:col-span-3">
          <div className="rounded-3xl border bg-white shadow-xl">
            <div className="border-b px-8 py-6">
              <h2 className="text-xl font-bold text-gray-800">
                Course Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Provide accurate information to help students understand your course.
              </p>
            </div>

            <div className="p-8">
              <CourseForm
                initialData={{}}
                onSubmit={handleSubmit}
                loading={loading || isSubmitting}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;
