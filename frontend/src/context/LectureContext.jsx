import { createContext, useContext, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const LectureContext = createContext();

export const LectureContextProvider = ({ children }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchLectures(courseId) {
    if (!courseId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/courses/${courseId}`);
      // Assuming lectures are embedded in the course object as "lectures"
      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  }

  async function addLecture(courseId, lectureData) {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/api/courses/${courseId}/lectures`,
        lectureData
      );
      setLectures((prev) => [...prev, response.data]);
      toast.success("Lecture added successfully");
      return response.data;
    } catch (error) {
      console.error("Error adding lecture:", error);
      toast.error("Failed to add lecture");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateLecture(courseId, lectureId, lectureData) {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/api/courses/${courseId}/lectures/${lectureId}`,
        lectureData
      );
      setLectures((prev) =>
        prev.map((lec) => (lec._id === lectureId ? response.data : lec))
      );
      toast.success("Lecture updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating lecture:", error);
      toast.error("Failed to update lecture");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteLecture(courseId, lectureId) {
    try {
      setLoading(true);
      await axiosInstance.delete(
        `/api/courses/${courseId}/lectures/${lectureId}`
      );
      setLectures((prev) => prev.filter((lec) => lec._id !== lectureId));
      toast.success("Lecture deleted successfully");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error("Failed to delete lecture");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <LectureContext.Provider
      value={{
        lectures,
        loading,
        fetchLectures,
        addLecture,
        updateLecture,
        deleteLecture,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};

export const LectureData = () => useContext(LectureContext);
