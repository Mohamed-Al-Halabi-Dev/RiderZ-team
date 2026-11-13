import axios from "axios";
import { clearAuth } from "../lib/auth";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mohameddev12-001-site1.ftempurl.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ ضروري جداً لتبادل الكوكيز بين Vercel و myASP
});

// ✅ Access Token في الذاكرة (مش localStorage)
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// ✅ Request Interceptor: بيضيف التوكن من الذاكرة
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: بيعالج 401 ويجدد التوكن
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
      // ✅ ما نحاول نجدد لو الطلب نفسه تبع login/register/refresh
      if (
        originalRequest.url.includes("/api/auth/login") ||
        originalRequest.url.includes("/api/auth/register") ||
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

      try {
        // ✅ الـ Refresh Token بالكوكي، ما منحتاج نبعته بالـ body
        const response = await api.post("/api/auth/refresh-token");
        const data = response.data?.data || {};

        // ✅ ندعم الشكلين (accessToken مباشرة أو token.token)
        const newToken = data.accessToken || data.token?.token;
        if (!newToken) throw new Error("No access token in refresh response");

        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        setAccessToken(null);
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