import React, { useEffect } from "react";
import { CourseData } from "../../../context/CourseContext";
import CourseList from "../../../components/ui/course/CourseList";
import staticTutorData from "../../../data/staticTutorData";
import Page from "../../../components/layout/common/Page";

const MyCourses = () => {
  const { fetchMyCourses, myCourses, loading, deleteCourse } = CourseData();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const localCourses = (myCourses && myCourses.length > 0) ? myCourses : staticTutorData.myCourses;

  return (
    <Page title="My Courses">
      <CourseList courses={localCourses} loading={loading} onDelete={deleteCourse} />
    </Page>
  );
};

export default MyCourses;
