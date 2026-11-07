import { createContext, useContext, useState, useMemo } from "react";
import {
  saveAuth,
  clearAuth,
  getToken,
  getUserId,
  getRole,
  getUserFromToken,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = getToken();
    if (!token) {
      return { id: null, role: null, token: null, isLoggedIn: false };
    }
    const decoded = getUserFromToken(token);
    return {
      id: decoded.id || getUserId(),
      role: decoded.role || getRole(),
      token,
      isLoggedIn: true,
    };
  });

  const login = ({ id, role, token, refreshToken }) => {
    let finalId = id;
    let finalRole = role;

    if ((!finalId || !finalRole) && token) {
      const decoded = getUserFromToken(token);
      finalId = finalId || decoded.id;
      finalRole = finalRole || decoded.role;
    }

    saveAuth({ id: finalId, role: finalRole, token, refreshToken }); 
    setUser({ id: finalId, role: finalRole, token, isLoggedIn: true });
  };

  const logout = () => {
    clearAuth();
    setUser({ id: null, role: null, token: null, isLoggedIn: false });
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAdmin: user.role === "Admin",
      isSupervisor: user.role === "Supervisor" || user.role === "Admin",
      isMember: user.role === "Member",
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}