const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken"; // ✅ جديد
const USER_ID_KEY = "userId";
const ROLE_KEY = "role";

// فك الـ JWT payload
export function decodeToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

// استخراج id و role من الـ JWT
export function getUserFromToken(token) {
  const payload = decodeToken(token);
  if (!payload) return { id: null, role: null };

  const id =
    payload.nameid ||
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    payload.sub ||
    payload.id ||
    null;

  const role =
    payload.role ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null;

  return { id: id ? String(id) : null, role: role || null };
}

export function saveAuth({ id, role, token, refreshToken }) {
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken); // ✅ جديد
  if (id) localStorage.setItem(USER_ID_KEY, String(id));
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY); // ✅ جديد
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY); // ✅ جديد
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}