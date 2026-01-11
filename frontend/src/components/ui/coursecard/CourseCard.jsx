import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../../context/UserContext";
import { CourseData } from "../../../context/CourseContext";
import { Clock, Star } from "lucide-react";
// import { getCourseRating } from '../../../utils/courseRatingApi';
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../../utils/config";

const CourseCard = ({ course, isTutor = false }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();


  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  useEffect(() => {
    let mounted = true;
    const fetchRating = async () => {
      try {
        const res = await axios.get(`${server}/api/courses/${course._id}/rating`);
        if (mounted) {
          setAvgRating(res.data?.data?.avgRating ?? null);
          setReviewCount(res.data?.data?.reviewCount ?? null);
        }
      } catch {
        if (mounted) {
          setAvgRating(null);
          setReviewCount(null);
        }
      }
    };
    if (user?.role !== 'ADMIN') {
      fetchRating();
    }
    // Listen for review update events
    const handler = (e) => {
      if (e.detail && e.detail.courseId === course._id) {
        fetchRating();
      }
    };
    window.addEventListener('course-review-updated', handler);
    return () => {
      mounted = false;
      window.removeEventListener('course-review-updated', handler);
    };
  }, [course._id]);

  const handleNavigate = () => {
    navigate(`/course/${course._id}`);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all">
      <img
        src={
          course?.image?.startsWith("http")
            ? course.image
            : `${server}${course.image}`
        }
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">
          {course.title}
        </h3>

        <p className="text-[#0D9488] font-medium mb-4">
          Instructor: {course?.tutor?.name}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span className="font-semibold text-[#1E3A8A]">
              {typeof avgRating === 'number' && !isNaN(avgRating) ? avgRating.toFixed(1) : '—'}
            </span>
            <span className="text-gray-500 text-sm">
              {reviewCount !== null ? `(${reviewCount} reviews)` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#0D9488]">
            <Clock size={16} />
            <span className="text-sm">{course.duration} weeks</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* <span className="text-2xl font-bold text-[#1E3A8A]">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </span> */}

          <button
            onClick={handleNavigate}
            className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
