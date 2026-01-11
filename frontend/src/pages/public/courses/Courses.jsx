import React, { useEffect, useState } from "react";
import { CourseData } from "../../../context/CourseContext";
import CourseCard from "../../../components/ui/coursecard/CourseCard";
import Header from "../../../components/ui/header/Header";

const Courses = () => {
  const { courses, fetchCoursesLazy, loading, hasMore, isFallback } = CourseData();
  const [showShimmer, setShowShimmer] = useState(false);
  useEffect(() => {
    let timer;
    if (loading) {
      setShowShimmer(true);
      timer = setTimeout(() => setShowShimmer(false), 1000); // 1 second shimmer min
    } else {
      if (!timer) setShowShimmer(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);
  useEffect(() => {
    if (courses.length === 0) fetchCoursesLazy();
  }, []);

  // Lazy load when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomThreshold = document.body.offsetHeight * 0.8;

      if (scrollPosition >= bottomThreshold) {
        fetchCoursesLazy(); // load next batch
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  // SHIMMER PLACEHOLDER
  const ShimmerCard = () => (
    <div className="animate-pulse bg-white shadow rounded-xl p-4">
      <div className="h-40 bg-gray-300 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E3A8A] mb-4">
              Our Courses
            </h2>
            <p className="text-xl text-[#0D9488]">
              Discover our most popular learning paths
            </p>
            {isFallback && (
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-sm">
                Showing static sample data
              </div>
            )}
          </div>

          {showShimmer && courses.length === 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          )}

          {courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {!showShimmer && courses.length === 0 && !loading && (
            <p className="text-center text-[#0D9488] text-lg w-full">
              No Courses Yet!
            </p>
          )}

          {showShimmer && courses.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          )}
          
          {!hasMore && !loading && !showShimmer && (
            <p className="text-center text-gray-500 text-md mt-10">
              You have reached the end.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
