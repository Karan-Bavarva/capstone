import React from "react";
import MetricCard from "../dashboard/MetricCard";

export default function TutorDashboardWidgets({ kpis, motivationalTip }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard title="My Courses" value={kpis.totalCourses} />
      <MetricCard title="Total Students" value={kpis.totalStudents} />
      <MetricCard title="Active Students (7d)" value={kpis.activeStudents} />
      <MetricCard title="Total Lectures" value={kpis.totalLectures} />
      <MetricCard title="Avg. Completion" value={kpis.avgCompletion + '%'} />
      {/* Commented out - all courses are free for now */}
      {/* <MetricCard title="Total Earnings" value={kpis.totalEarnings} /> */}
      {/* <MetricCard title="Monthly Earnings" value={kpis.monthlyEarnings} /> */}
      <MetricCard title="Courses Uploaded (Month)" value={kpis.monthlyCourses} />
      <MetricCard title="Lectures Uploaded (Month)" value={kpis.monthlyLectures} />
      <MetricCard title="Upload Streak" value={kpis.streak + ' days'} />
    </div>
  );
}

export function MotivationalTip({ tip }) {
  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-indigo-800 mb-6">
      <span role="img" aria-label="motivation">💡</span> {tip}
    </div>
  );
}
