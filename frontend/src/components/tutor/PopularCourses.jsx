import React from "react";

export default function PopularCourses({ courses = [] }) {
  if (!courses.length) {
    return <div className="text-gray-500 text-center">No popular courses yet.</div>;
  }
  return (
    <div>
      <h3 className="font-semibold mb-3">Popular Courses</h3>
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course._id} className="p-3 bg-gray-50 rounded-lg flex flex-col gap-1 shadow-sm">
            <div className="font-medium">{course.title}</div>
            <div className="text-xs text-gray-500">{course.enrollments} enrollments</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${course.completionRate || 60}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
