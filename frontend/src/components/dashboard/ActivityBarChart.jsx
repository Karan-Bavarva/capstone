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

export default function ActivityBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Learning Activity</h3>
        <div className="text-xs text-gray-500">Per Course</div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="courseTitle" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => v + "%"} />
          <Tooltip formatter={(v) => v + "%"} />
          <Legend />
          <Bar dataKey="progressPercent" fill="#6366f1" name="Progress" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
