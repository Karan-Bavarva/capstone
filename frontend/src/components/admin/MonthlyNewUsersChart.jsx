import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MonthlyNewUsersChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-500">
        No user data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Monthly New Users</h3>
        <div className="text-xs text-gray-500">Last 12 months</div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="users" name="New Users" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyNewUsersChart;
