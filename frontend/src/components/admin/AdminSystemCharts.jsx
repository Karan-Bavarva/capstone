import React from "react";
import ActivityBarChart from "../dashboard/ActivityBarChart";
import MonthlyNewUsersChart from "./MonthlyNewUsersChart";

export default function AdminSystemCharts({ topCourses = [], kpis = {} }) {
  // Prepare data for ActivityBarChart (progress per top course)
  const activityData = topCourses.map((c) => ({
    courseTitle: c.title,
    progressPercent: c.avgCompletion || 0,
  }));


  // Use real data from backend if available
  const monthlyNewUsersData = Array.isArray(kpis.monthlyNewUsersData)
    ? kpis.monthlyNewUsersData
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ActivityBarChart data={activityData} />
      <MonthlyNewUsersChart data={monthlyNewUsersData} />
    </div>
  );
}
