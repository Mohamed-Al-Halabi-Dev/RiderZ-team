import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import api, { setAccessToken } from "../config/api";
import {
  saveUserData,
  clearAuth,
  getUserId,
  getRole,
  getUserFromToken,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: null, role: null, isLoggedIn: false });
  const [bootstrapping, setBootstrapping] = useState(true);

  // ✅ عند تحميل الموقع، نحاول نجيب Access Token جديد عبر الكوكي
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const res = await api.post("/api/auth/refresh-token");
        if (cancelled) return;

        const data = res.data?.data || {};
        const newToken = data.accessToken || data.token?.token;

        if (!newToken) {
          setBootstrapping(false);
          return;
        }

        setAccessToken(newToken);

        const decoded = getUserFromToken(newToken);
        const finalId = data.id || decoded.id || getUserId();
        const finalRole = data.role || decoded.role || getRole();

        saveUserData({ id: finalId, role: finalRole });
        setUser({ id: finalId, role: finalRole, isLoggedIn: true });
      } catch {
        // ما في كوكي صالحة → المستخدم مش مسجل دخول
        clearAuth();
        setAccessToken(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ دالة تسجيل الدخول (تاخد accessToken مش token)
  const login = ({ id, role, accessToken: token }) => {
    if (token) setAccessToken(token);

    let finalId = id;
    let finalRole = role;

    if ((!finalId || !finalRole) && token) {
      const decoded = getUserFromToken(token);
      finalId = finalId || decoded.id;
      finalRole = finalRole || decoded.role;
    }

    saveUserData({ id: finalId, role: finalRole });
    setUser({ id: finalId, role: finalRole, isLoggedIn: true });
  };

  // ✅ دالة تسجيل الخروج (بتمسح الكوكي من السيرفر)
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // حتى لو فشل، منمسح من عندنا
    }
    clearAuth();
    setAccessToken(null);
    setUser({ id: null, role: null, isLoggedIn: false });
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      bootstrapping,
      isAdmin: user.role === "Admin",
      isSupervisor: user.role === "Supervisor" || user.role === "Admin",
      isMember: user.role === "Member",
    }),
    [user, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}