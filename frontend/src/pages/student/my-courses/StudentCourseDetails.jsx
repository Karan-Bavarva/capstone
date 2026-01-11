import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CourseData } from "../../../context/CourseContext";
import {
  Play,
  FileText,
  Clock,
  CheckCircle,
  BookOpen,
  AlertCircle,
  Download,
} from "lucide-react";
import { server } from "../../../utils/config";
import axiosInstance from "../../../utils/axiosInstance";

/* ---------------- Helpers ---------------- */

const formatDuration = (durationInMinutes) => {
  if (durationInMinutes === undefined || durationInMinutes === null) return "";
  const totalSeconds = Math.floor(durationInMinutes * 60);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const normalizeId = (id) => (typeof id === "string" ? id : id?.$oid);

/* ---------------- Component ---------------- */

const StudentCourseDetails = () => {
  const { id } = useParams();
  const { fetchCourseById, course, updateProgress } = CourseData();

  const [activeLecture, setActiveLecture] = useState(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState(null);
  const [progressUpdating, setProgressUpdating] = useState(false);
  const [progressError, setProgressError] = useState(null);

  useEffect(() => {
    fetchCourseById(id);
  }, [id]);

  const fetchEnrollmentProgress = async (courseId) => {
    try {
      const res = await axiosInstance.get(
        `/api/enrollments/${courseId}/progress`
      );
      setEnrollmentProgress(res.data);
    } catch {
      setEnrollmentProgress(null);
    }
  };

  useEffect(() => {
    if (course?._id) fetchEnrollmentProgress(course._id);
  }, [course]);

  const lecturesWithCompletion = (course?.lectures || []).map((lec) => {
    const progressEntry = enrollmentProgress?.progress?.find(
      (p) => normalizeId(p.lectureId) === normalizeId(lec._id)
    );
    return { ...lec, completed: Boolean(progressEntry?.completed) };
  });

  useEffect(() => {
    if (!activeLecture && lecturesWithCompletion.length) {
      setActiveLecture(lecturesWithCompletion[0]);
    }
  }, [lecturesWithCompletion]);

  const isCompleted = Boolean(activeLecture?.completed);

  const handleMarkComplete = async () => {
    if (!activeLecture || isCompleted) return;
    setProgressUpdating(true);
    setProgressError(null);

    try {
      await updateProgress(course._id, activeLecture._id);
      await fetchEnrollmentProgress(course._id);

      const index = lecturesWithCompletion.findIndex(
        (l) => normalizeId(l._id) === normalizeId(activeLecture._id)
      );
      if (lecturesWithCompletion[index + 1]) {
        setActiveLecture(lecturesWithCompletion[index + 1]);
      }
    } catch {
      setProgressError("Failed to update progress. Please try again.");
    } finally {
      setProgressUpdating(false);
    }
  };

  const completedLectures = lecturesWithCompletion.filter(
    (l) => l.completed
  ).length;
  const totalLectures = lecturesWithCompletion.length;
  const completionPercent = totalLectures
    ? Math.round((completedLectures / totalLectures) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ================= Header ================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <h1 className="font-semibold text-slate-900 truncate">
            {course?.title}
          </h1>

          <div className="flex items-center gap-3 min-w-[160px]">
            <span className="text-sm font-semibold text-blue-600">
              {completionPercent}%
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= Intro ================= */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-extrabold text-slate-900">
          {course?.title}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          {course?.description}
        </p>
      </section>

      {/* ================= Body ================= */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl text-white flex items-center gap-2">
              <BookOpen size={20} />
              <h2 className="text-xl font-bold">Lectures</h2>
            </div>

            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {lecturesWithCompletion.map((lec, i) => {
                const active =
                  normalizeId(lec._id) === normalizeId(activeLecture?._id);
                return (
                  <button
                    key={lec._id}
                    onClick={() => setActiveLecture(lec)}
                    className={`w-full p-4 text-left transition-all hover:bg-slate-50 ${
                      active
                        ? "bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-600"
                        : ""
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        lec.completed
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {i + 1}. {lec.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
        <main className="lg:col-span-9 space-y-6">
          {!activeLecture ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-xl">
              <Play size={48} className="mx-auto text-slate-400 mb-4" />
              Select a lecture to start learning
            </div>
          ) : (
            <>
              {/* Video */}
              <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
                {activeLecture.videoUrl ? (
                  getEmbedUrl(activeLecture.videoUrl)?.includes("embed") ? (
                    <iframe
                      className="w-full aspect-video"
                      src={getEmbedUrl(activeLecture.videoUrl)}
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="w-full"
                      controls
                      src={`${server}${activeLecture.videoUrl}`}
                      onEnded={handleMarkComplete}
                    />
                  )
                ) : (
                  <div className="aspect-video flex items-center justify-center text-white">
                    No video available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border p-8">
                <h3 className="text-3xl font-bold text-slate-900">
                  {activeLecture.title}
                </h3>

                {/* Meta */}
                <div className="flex gap-4 mt-3 text-sm text-slate-600">
                  {activeLecture.duration !== undefined && (
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {formatDuration(activeLecture.duration)}
                    </span>
                  )}

                  {isCompleted && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle size={16} />
                      Completed
                    </span>
                  )}
                </div>

                {/* Action */}
                {!isCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={progressUpdating}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg"
                  >
                    {progressUpdating
                      ? "Marking Complete..."
                      : "Mark as Completed"}
                  </button>
                )}

                {/* Notes Section UNDER THE RESPECTIVE LECTURE */}
                {(activeLecture.noteFiles?.length > 0 ||
                  (activeLecture.notes && activeLecture.notes.length > 0)) && (
                  <div className="mt-10">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileText className="text-blue-600" />
                      Lecture Notes
                    </h4>

                    <div className="space-y-3">
                      {activeLecture.noteFiles?.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-50 border rounded-xl p-4"
                        >
                          <span className="font-medium">
                            {file.split("/").pop()}
                          </span>
                          <a
                            href={`${server}${file}`}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-blue-600 font-semibold"
                          >
                            <Download size={16} /> Download
                          </a>
                        </div>
                      ))}

                      {/* fallback for legacy notes array */}
                      {activeLecture.notes &&
                        activeLecture.notes.length > 0 &&
                        activeLecture.notes.map((note, idx) => (
                          <div
                            key={`legacy-note-${idx}`}
                            className="flex items-center justify-between bg-slate-50 border rounded-xl p-4"
                          >
                            <span className="font-medium">
                              {note.title || `Note ${idx + 1}`}
                            </span>
                            <a
                              href={`${server}${note.fileUrl}`}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 text-blue-600 font-semibold"
                            >
                              <Download size={16} /> Download
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {progressError && (
                  <div className="mt-6 flex gap-2 bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                    <AlertCircle className="text-red-600" />
                    {progressError}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentCourseDetails;
