import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

import MetricCard from "../dashboard/MetricCard";
import AdminSystemCharts from "./AdminSystemCharts";

export default function AdminSystemDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/dashboard-summary");
        setMetrics(res.data);
      } catch (err) {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  const kpis = metrics?.kpis || {};

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Students" value={kpis.totalStudents ?? "—"} />
        <MetricCard title="Active Students (7d)" value={kpis.activeStudents ?? "—"} />
        <MetricCard title="Total Courses" value={kpis.totalCourses ?? "—"} />
        <MetricCard title="Total Lectures" value={kpis.totalLectures ?? "—"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Avg. Completion (%)" value={kpis.avgCompletion ?? "—"} />
        <MetricCard title="New Users (Month)" value={kpis.monthlyNewUsers ?? "—"} />
        <MetricCard title="New Courses (Month)" value={kpis.monthlyNewCourses ?? "—"} />
        <MetricCard title="New Enrollments (Month)" value={kpis.monthlyEnrollments ?? "—"} />
      </div>

      {/* Charts Section */}
      <AdminSystemCharts topCourses={metrics?.topCourses || []} kpis={{ ...kpis, monthlyNewUsersData: metrics?.monthlyNewUsersData || [] }} />

      {/* Top Courses Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Top Courses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Enrollments</th>
                <th className="py-2 px-4">Avg. Completion</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.topCourses?.length ? metrics.topCourses.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="py-2 px-4 font-medium">{c.title}</td>
                  <td className="py-2 px-4">{c.enrollments}</td>
                  <td className="py-2 px-4">{c.avgCompletion}%</td>
                </tr>
              )) : <tr><td colSpan={3} className="py-2 px-4 text-gray-400">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Enrollments (2 days)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 px-4">Student</th>
                <th className="py-2 px-4">Course</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentEnrollments?.length ? metrics.recentEnrollments.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="py-2 px-4">{e.student?.name || '-'} </td>
                  <td className="py-2 px-4">{e.course?.title || '-'} </td>
                  <td className="py-2 px-4">{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : <tr><td colSpan={3} className="py-2 px-4 text-gray-400">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Streak */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Streak</h2>
        <div>Current streak: <span className="font-bold">{kpis.streak ?? 0}</span> days</div>
        {metrics?.lastUpload && (
          <div className="text-sm text-gray-500 mt-1">Last upload: {new Date(metrics.lastUpload).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}
