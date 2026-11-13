const USER_ID_KEY = "userId";
const ROLE_KEY = "role";

// ✅ دالة فك تشفير JWT (باقية زي ما هي)
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

// ✅ حفظ بيانات المستخدم فقط (بدون توكن)
export function saveUserData({ id, role }) {
  if (id) localStorage.setItem(USER_ID_KEY, String(id));
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth() {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}