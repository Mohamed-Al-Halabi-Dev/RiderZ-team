import axios from "axios";
import { getToken } from "../lib/auth";

// ✅ الرابط الجديد للباك إند على الاستضافة
const BACKEND_URL = "https://mohameddev12-001-site1.ftempurl.com";

const api = axios.create({
  baseURL: BACKEND_URL,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(error.config?.headers?.Authorization);

      if (hadToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ✅ تحديث الـ API_URL كمان عشان الصور والملفات تظهر صح
export const API_URL = BACKEND_URL;
export const PAGE_SIZE = 12;



