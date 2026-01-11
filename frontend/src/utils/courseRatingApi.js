import axios from 'axios';

export const getCourseRating = async (courseId) => {
  const res = await axios.get(`/api/courses/${courseId}/review`);
  return res.data;
};
