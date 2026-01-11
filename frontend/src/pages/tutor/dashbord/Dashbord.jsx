
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import MetricCard from "../../../components/dashboard/MetricCard";
import ChartPlaceholder from "../../../components/dashboard/ChartPlaceholder";
import RecentEnrollments from "../../../components/tutor/RecentEnrollments";
import PopularCourses from "../../../components/tutor/PopularCourses";
import CourseEnrollmentsChart from "../../../components/tutor/CourseEnrollmentsChart";
import CoursePerformanceChart from "../../../components/tutor/CoursePerformanceChart";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/tutor/dashboard");
        setDashboard(res.data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!dashboard || !dashboard.kpis) {
    return <div className="text-red-500">Dashboard data is unavailable. Please try again later.</div>;
  }

  const { kpis, topCourses, recentEnrollments } = dashboard;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tutor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="My Courses" value={kpis.totalCourses ?? "—"} />
        <MetricCard title="Total Students" value={kpis.totalStudents ?? "—"} />
        <MetricCard title="Active Students (7d)" value={kpis.activeStudents ?? "—"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
        <div className="xl:col-span-4 space-y-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <CourseEnrollmentsChart courses={topCourses || []} />
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <CoursePerformanceChart courses={topCourses || []} />
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <PopularCourses courses={topCourses || []} />
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <RecentEnrollments enrollments={recentEnrollments || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
      
