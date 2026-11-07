import axios from "axios";
import {
  getToken,
  getRefreshToken,
  saveAuth,
  clearAuth,
  getUserId,
  getRole,
} from "../lib/auth";

export const API_URL = import.meta.env.VITE_API_URL || "https://mohameddev12-001-site1.ftempurl.com";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ إدارة الـ Refresh Token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url.includes("/api/auth/login") ||
        originalRequest.url.includes("/api/auth/refresh-token")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_URL}/api/auth/refresh-token`,
          { refreshToken }
        );

        const newData = response.data.data;

        saveAuth({
          id: newData.id || getUserId(),
          role: newData.role || getRole(),
          token: newData.token,
          refreshToken: newData.refreshToken,
        });

        api.defaults.headers.common["Authorization"] = `Bearer ${newData.token}`;
        processQueue(null, newData.token);

        originalRequest.headers.Authorization = `Bearer ${newData.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;


export const PAGE_SIZE = 12;