import React from "react";

const StudentList = ({ students = [] }) => {
  if (!students.length) {
    return <div className="text-gray-500 text-sm">No students enrolled yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Course</th>
            <th className="px-3 py-2 text-left">Progress</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="border-b">
              <td className="px-3 py-2">{s.name}</td>
              <td className="px-3 py-2">{s.email}</td>
              <td className="px-3 py-2">{s.course}</td>
              <td className="px-3 py-2">{s.progress}%</td>
              <td className="px-3 py-2">{s.status}</td>
              <td className="px-3 py-2">{s.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
