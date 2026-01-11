import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { server } from "../utils/config";
import toast from "react-hot-toast";
import { UserData } from "./UserContext";
import staticCourses from "../data/staticCourses";

const axios = axiosInstance;
const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const { user } = UserData();
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [paginatedCourses, setPaginatedCourses] = useState([]);
  const [lazyPage, setLazyPage] = useState(1);
  const [lazyLimit] = useState(6);

  const fetchCourses = async ({
    page = 1,
    limit = 6,
    status = "",
    published = "",
    search = "",
  } = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${server}/api/courses`, {
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
          ...(published !== "" ? { published } : {}),
          ...(search ? { search } : {}),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data, meta } = response;

      setCourses(Array.isArray(data) ? data : []);
      setIsFallback(false);

      setTotalPages(meta?.pagination?.totalPages || 1);
      setTotalRecords(meta?.pagination?.totalRecords || 0);

      return data || [];
    } catch (err) {
      toast.error("Failed to load courses — showing static data");

      setCourses(staticCourses.slice(0, limit));
      setIsFallback(true);

      setTotalPages(1);
      setTotalRecords(staticCourses.length);

      return staticCourses.slice(0, limit);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesLazy = async () => {
    setLoading(true);
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    try {
      const token = localStorage.getItem("accessToken");
      const [{ data, meta }] = await Promise.all([
        axios.get(`${server}/api/courses?page=${page}&limit=${lazyLimit}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        delay(1000),
      ]);

      if (data?.length < lazyLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setCourses((prev) => [...prev, ...(data || [])]);

      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // SINGLE COURSE
  async function fetchCourse(id) {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${server}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response?.data;
      if (!data || Object.keys(data).length === 0) {
        // fallback: pick a static course
        setCourse(staticCourses[0]);
        setIsFallback(true);
      } else {
        setCourse(data);
        setIsFallback(false);
      }
    } catch (error) {
      toast.error("Failed to load course details — showing static course");
      setCourse(staticCourses[0]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyCourses() {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${server}/api/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching enrolled/tutor courses:", error);
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFeaturedCourses() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${server}/api/courses/featured-courses`
      );
      const data = response?.data;
      if (!data || data.length === 0) {
        setIsFallback(true);
        return staticCourses.slice(0, 3);
      }
      setIsFallback(false);
      return data || [];
    } catch {
      toast.error("Failed to load featured courses — using static data");
      return staticCourses.slice(0, 3);
    } finally {
      setLoading(false);
    }
  }

  async function createCourse(formData) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("/api/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // return created course or true
    } catch (error) {
      console.error("Create course failed:", error);
      return null; // or false
    }
  }

  async function deleteCourse(courseId) {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the courses list after successful deletion
      setMyCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Failed to delete course:", error);
      throw error; // so caller knows deletion failed
    }
  }

  async function publishCourse(courseId, publish = true) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `/api/courses/${courseId}/publish`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { publish },
        }
      );
      toast.success(`Course ${publish ? "published" : "unpublished"}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to update publish status");
      throw error;
    }
  }
  // FETCH COURSE BY ID
  const fetchCourseById = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${server}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourse(res.data);
      return res.data;
    } catch (err) {
      toast.error("Failed to fetch course");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE COURSE
  const updateCourse = async (id, payload) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const form = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image" && !(value instanceof File)) {
            return;
          }

          // If value is array (eg. curriculum), append each item separately
          if (Array.isArray(value)) {
            value.forEach((v) => form.append(key, v));
          } else {
            form.append(key, value);
          }
        }
      });

      const res = await axios.put(`${server}/api/courses/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course updated successfully");
      return res.data.course;
    } catch (err) {
      toast.error("Failed to update course");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add or Update Lecture API
  const addOrUpdateLecture = async (courseId, lectureId, payload) => {
    try {
      const token = localStorage.getItem("accessToken");
      // Support both FormData (constructed in the component) and plain objects
      let form;
      if (payload instanceof FormData) {
        form = payload;
      } else {
        form = new FormData();
        // Append all payload keys and values
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // If value is array (eg. noteFiles or existingNoteFiles), append each item separately
            if (Array.isArray(value)) {
              value.forEach((v) => form.append(key, v));
            } else {
              form.append(key, value);
            }
          }
        });
      }

      let response;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let axios set Content-Type with proper boundary for FormData
        },
      };

      if (lectureId) {
        response = await axios.put(
          `${server}/api/courses/${courseId}/lectures/${lectureId}`,
          form,
          config
        );
        toast.success("Lecture updated successfully");
      } else {
        response = await axios.post(
          `${server}/api/courses/${courseId}/lectures`,
          form,
          config
        );
        toast.success("Lecture added successfully");
      }

      if (response.data) {
        setCourse((prev) => ({
          ...prev,
          lectures: response.data.lectures || [],
        }));
      } else {
        // fallback if no data returned
        await fetchCourseById(courseId);
      }

      return true;
    } catch (error) {
      toast.error("Failed to add/update lecture");
      console.error(error);
      return false;
    }
  };

  // Delete Lecture API
  const deleteLecture = async (courseId, lectureId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${server}/api/courses/${courseId}/lectures/${lectureId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Lecture deleted successfully");

      // After delete, refresh the course info to get updated lectures list
      await fetchCourseById(courseId);
    } catch (error) {
      toast.error("Failed to delete lecture");
      console.error(error);
    }
  };

  // new enrollment
  const enrollCourse = async (courseId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${server}/api/enrollments/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Successfully enrolled in the course");
      await fetchCourse(courseId);
      return true;
    } catch (err) {
      toast.error("Enrollment failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    if (user?.role === 'ADMIN') {
      setMyEnrollments([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${server}/api/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Log for debugging response shape
      console.log("Enrollments API response:", response.data);

      // Ensure data is an array
      if (Array.isArray(response.data)) {
        setMyEnrollments(response.data);
      } else if (response.data?.enrollments) {
        // fallback if API wraps data inside an object
        setMyEnrollments(response.data.enrollments);
      } else {
        setMyEnrollments([]);
        toast.error("No enrolled courses found");
      }
    } catch (error) {
      console.error("Error fetching my enrollments:", error);
      toast.error("Failed to load your enrolled courses");
      setMyEnrollments([]);
    } finally {
      setLoading(false);
    }
  };
  async function updateProgress(courseId, lectureId) {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/enrollments/${courseId}/progress`,
        { lectureId, completed: true }
      );

      // Update local course state lectures array with completed = true
      setCourse((prevCourse) => ({
        ...prevCourse,
        lectures: prevCourse.lectures.map((lec) =>
          lec._id === lectureId ? { ...lec, completed: true } : lec
        ),
      }));

      toast.success("Progress updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <CourseContext.Provider
      value={{
        totalPages,
        totalRecords,
        courses,
        course,
        loading,
        isFallback,
        course,
        hasMore,
        myCourses,
        myEnrollments,
        fetchCourses,
        fetchCourse,
        fetchMyCourses,
        fetchFeaturedCourses,
        createCourse,
        deleteCourse,
        publishCourse,
        setCourse,
        fetchCoursesLazy,
        fetchCourseById,
        updateCourse,
        addOrUpdateLecture,
        deleteLecture,
        enrollCourse,
        fetchMyEnrollments,
        updateProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
