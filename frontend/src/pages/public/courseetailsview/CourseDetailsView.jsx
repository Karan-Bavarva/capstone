import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../../context/CourseContext";
import { UserData } from "../../../context/UserContext";
import {
  Clock,
  Play,
  Youtube,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

import Header from "../../../components/ui/header/Header";
import { server } from "../../../utils/config";
import axiosInstance from "../../../utils/axiosInstance";
import CurriculumSection from "../../../components/common/CurriculumSection";

const CourseDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchCourse,
    course,
    enrollCourse,
    loading,
    error,
    myEnrollments,
    fetchMyEnrollments,
  } = CourseData();
  const { user, isAuth } = UserData();

  const [openLecture, setOpenLecture] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Review state
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [courseAvgRating, setCourseAvgRating] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  useEffect(() => {
    if (user && (!myEnrollments || myEnrollments.length === 0)) {
      fetchMyEnrollments();
    }
  }, [user]);

  useEffect(() => {
    if (user && course && myEnrollments) {
      setEnrolled(
        myEnrollments.some(
          (e) => e.course === course._id || e.course?._id === course._id
        )
      );
    } else {
      setEnrolled(false);
    }
  }, [course, user, myEnrollments]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!course?._id || !isAuth || !user) return;

      try {
        const { data } = await axiosInstance.get(
          `/api/courses/${course._id}/review`
        );

        setCourseAvgRating(data.avgRating || null);
        setAllReviews(data.reviews || []);

        const myReview = data.reviews?.find(
          (r) => r.user?._id === user._id
        );

        if (myReview) {
          setUserReview(myReview.review || "");
          setUserRating(myReview.rating || 0);
          setHasReviewed(true);
        } else {
          setUserReview("");
          setUserRating(0);
          setHasReviewed(false);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [course?._id, user?._id, isAuth]);

  const handleEnroll = async () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    const success = await enrollCourse(id);
    if (success) {
      await fetchMyEnrollments();
      setEnrolled(true);
    }
    setEnrolling(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError("");

    try {
      await axiosInstance.post(`/api/courses/${course._id}/review`, {
        rating: userRating,
        review: userReview,
      });

      // Re-fetch reviews to persist state
      const { data } = await axiosInstance.get(
        `/api/courses/${course._id}/review`
      );

      setCourseAvgRating(data.avgRating);
      setAllReviews(data.reviews || []);

      const myReview = data.reviews?.find(
        (r) => r.user?._id === user._id
      );
      if (myReview) {
        setUserReview(myReview.review);
        setUserRating(myReview.rating);
        setHasReviewed(true);
      }

      window.dispatchEvent(
        new CustomEvent("course-review-updated", {
          detail: { courseId: course._id },
        })
      );
    } catch (err) {
      setReviewError("Failed to submit review. Try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) return <p className="text-center mt-20">Loading...</p>;

  const totalDuration =
    course.lectures?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;

  const curriculumArray = Array.isArray(course.curriculum)
    ? course.curriculum
    : [];

  return (
    <div className="min-h-screen">
      <Header />


      <div className="py-10 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <img
            src={`${server}${course.image}`}
            alt={course.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="mt-4 text-gray-700">{course.description}</p>

            <div className="flex gap-10 mt-6 text-gray-700">
              <span className="flex items-center gap-2">
                <Clock size={18} /> {totalDuration} mins
              </span>
              {/* Commented out - all courses are free for now */}
              {/* <span className="text-2xl font-bold text-green-700">
                ₹{course.price}
              </span> */}
              <span>
                Instructor: {" "}
                <b>{course?.tutor?.name}</b>
              </span>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolled || enrolling}
              className={`mt-6 px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${
                enrolled
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : enrolling
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "border border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
              }`}
            >
              {enrolling ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Enrolling...</span>
                </>
              ) : enrolled ? (
                "Enrolled"
              ) : (
                "Enroll Now"
              )}
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>

        <CurriculumSection lectures={course.lectures || []} curriculum={course.curriculum || []} />

        {isAuth && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-2">Your Course Rating</h2>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="font-semibold">
                {courseAvgRating?.toFixed(1) || "—"}
              </span>
              <span className="text-gray-500">
                ({allReviews.length} reviews)
              </span>
            </div>

            {enrolled && !hasReviewed && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setUserRating(i)}
                      className={`text-2xl ${
                        userRating >= i ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                />

                {reviewError && (
                  <p className="text-red-600 mb-2">{reviewError}</p>
                )}

                <button
                  disabled={submitting || userRating === 0}
                  className="bg-green-600 text-white px-6 py-2 rounded"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {hasReviewed && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-yellow-400 text-xl">
                  {"★".repeat(userRating)}
                  {"☆".repeat(5 - userRating)}
                </div>
                <p className="mt-2">{userReview}</p>
                <p className="text-xs text-gray-400 mt-1">
                  You already reviewed this course
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsView;
