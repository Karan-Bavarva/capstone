import React from "react";

const RecentEnrollments = ({ enrollments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Recent Enrollments</h3>
      {enrollments.length === 0 ? (
        <div className="text-sm text-gray-500">No recent enrollments</div>
      ) : (
        <div className="space-y-2">
          {enrollments.map((e) => (
            <div key={e._id || e.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{e.student?.name || e.studentName || "Unknown Student"}</div>
                <div className="text-xs text-gray-500">{e.course?.title || e.courseTitle || "Unknown Course"}</div>
              </div>
              <div className="text-sm text-gray-500">{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "-"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentEnrollments;
