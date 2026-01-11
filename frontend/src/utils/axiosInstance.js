import axios from "axios";
import { server } from "./config";

const axiosInstance = axios.create({
  baseURL: server,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => {
    const backend = response.data; // API always returns {meta, data}
    const { meta, data } = backend;

    // If backend says "status false" → treat as error
    if (meta?.status === false) {
      return Promise.reject({
        message: meta.message,
        data: data,
      });
    }

   return { data, meta }; 
  },

  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const apiRes = await axios.post(`${server}/api/auth/refresh`, {
            token: refreshToken,
          });

          const newAccess = apiRes.data.data.access;

          localStorage.setItem("accessToken", newAccess);

          // Retry original request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          console.error("Refresh failed:", refreshErr);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
