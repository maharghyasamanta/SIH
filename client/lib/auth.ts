export type AppRole = "admin" | "ordinary";

const ROLE_KEY = "disasterai-role";
const MOBILE_KEY = "disasterai-mobile";

export function getStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const role = window.localStorage.getItem(ROLE_KEY);
  return role === "admin" || role === "ordinary" ? role : null;
}

export function setStoredRole(role: AppRole) {
  window.localStorage.setItem(ROLE_KEY, role);
}

export function getStoredMobile() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(MOBILE_KEY);
}

export function setStoredMobile(mobile: string) {
  window.localStorage.setItem(MOBILE_KEY, mobile);
}

export function isValidMobile(mobile: string) {
  return /^\+?[1-9]\d{9,14}$/.test(mobile.trim());
}

export function clearStoredRole() {
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(MOBILE_KEY);
}
