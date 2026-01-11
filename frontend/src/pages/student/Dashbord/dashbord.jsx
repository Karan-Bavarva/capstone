
import React, { useEffect, useState } from "react";
import MetricCard from "../../../components/dashboard/MetricCard";
import ActivityBarChart from "../../../components/dashboard/ActivityBarChart";
import Page from "../../../components/layout/common/Page";
import axiosInstance from "../../../utils/axiosInstance";

export default function Dashbord() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/api/enrollments/dashboard")
      .then((res) => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      });
  }, []);

  if (loading) return <Page title="Student Dashboard"><div className="py-20 text-center text-lg">Loading...</div></Page>;
  if (error) return <Page title="Student Dashboard"><div className="py-20 text-center text-red-500">{error}</div></Page>;
  if (!dashboard) return null;

  return (
    <Page title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Enrolled Courses" value={dashboard.totalEnrolled} icon={<span className="material-icons text-blue-500">school</span>} />
        <MetricCard title="Completed Courses" value={dashboard.completedCourses} icon={<span className="material-icons text-green-500">check_circle</span>} />
        <MetricCard title="Certificates" value={dashboard.certificates} icon={<span className="material-icons text-yellow-500">emoji_events</span>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <ActivityBarChart data={dashboard.activity} />
          {/* Motivational Widget Example */}
          <div className="mt-6 p-6 bg-gradient-to-r from-indigo-100 to-blue-50 rounded-xl shadow flex items-center">
            <span className="material-icons text-4xl text-indigo-500 mr-4">emoji_objects</span>
            <div>
              <div className="font-semibold text-indigo-700">Keep Learning!</div>
              <div className="text-gray-600 text-sm">You're making great progress. Stay consistent and complete your next course!</div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Your Courses</h3>
            <div className="space-y-3">
              {dashboard.activity.map((e, idx) => (
                <div key={idx} className="p-3 border rounded bg-gradient-to-r from-blue-50 to-white">
                  <div className="font-medium text-blue-800">{e.courseTitle}</div>
                  <div className="text-sm text-gray-500">Progress: {e.progressPercent}%</div>
                  {e.progressPercent === 100 && <div className="text-xs text-green-600 font-semibold mt-1">Completed!</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
