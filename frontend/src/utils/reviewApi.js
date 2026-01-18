import axios from 'axios';

const API_BASE = '/api/reviews';

const API = axios.create({
  baseURL: "https://openlearn-backend.onrender.com/api"
});


export const getCourseRating = async (courseId) => {
  const res = await axios.get(`${API_BASE}/${courseId}`);
  return res.data;
};

export const submitCourseReview = async ({ courseId, rating, review }) => {
  const res = await axios.post(`${API_BASE}/`, { courseId, rating, review });
  return res.data;
};

export const getAllReviews = async () => {
  const res = await axios.get(`${API_BASE}/`);
  return res.data;
};
