import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function CourseEnrollmentsChart({ courses = [] }) {
  // Prepare data: [{ title, enrollments }]
  const data = courses.map((c) => ({
    name: c.title,
    Enrollments: c.enrollments || 0,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-sm font-semibold mb-2">Course-wise Student Enrollments</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Enrollments" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
