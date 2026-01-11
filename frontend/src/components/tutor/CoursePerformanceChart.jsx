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

export default function CoursePerformanceChart({ courses = [] }) {
  // Prepare data: [{ title, avgCompletion }]
  const data = courses.map((c) => ({
    name: c.title,
    "Avg. Completion (%)": c.avgCompletion || 0,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-sm font-semibold mb-2">Course Performance (Avg. Completion)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => v + "%"} />
          <Tooltip formatter={(v) => v + "%"} />
          <Legend />
          <Bar dataKey="Avg. Completion (%)" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
