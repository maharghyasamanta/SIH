export type AppRole = "admin" | "ordinary";

const ROLE_KEY = "disasterai-role";

export function getStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const role = window.localStorage.getItem(ROLE_KEY);
  return role === "admin" || role === "ordinary" ? role : null;
}

export function setStoredRole(role: AppRole) {
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearStoredRole() {
  window.localStorage.removeItem(ROLE_KEY);
}
