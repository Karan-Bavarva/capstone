import React, { useEffect, useState } from "react";
import Page from "../../../components/layout/common/Page";
import axiosInstance from "../../../utils/axiosInstance";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/api/enrollments/dashboard")
      .then((res) => {
        // Only completed courses
        const completed = (res.data.activity || []).filter(
          (c) => c.progressPercent === 100
        );
        setCertificates(completed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load certificates");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Page title="Certificates">
        <div className="py-20 text-center text-lg">Loading...</div>
      </Page>
    );
  if (error)
    return (
      <Page title="Certificates">
        <div className="py-20 text-center text-red-500">{error}</div>
      </Page>
    );

  return (
    <Page title="Certificates">
      <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>
      {certificates.length === 0 ? (
        <div className="text-gray-500">No certificates available yet. Complete a course to earn a certificate!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="material-icons text-5xl text-yellow-500 mb-2">emoji_events</span>
              <div className="font-semibold text-lg mb-1 text-center">{cert.courseTitle}</div>
              <div className="text-sm text-gray-500 mb-4">Completed</div>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    const res = await fetch(
                      `${import.meta.env.VITE_SERVER_URL || "http://localhost:5001"}/api/certificates/download?course=${encodeURIComponent(cert.courseTitle)}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (!res.ok) throw new Error("Failed to download certificate");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `certificate-${cert.courseTitle}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    alert("Download failed. Please try again.");
                  }
                }}
              >
                Download Certificate (PDF)
              </button>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
