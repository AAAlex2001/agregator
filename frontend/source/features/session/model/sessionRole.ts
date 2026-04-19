import type { SessionRole } from "./types";

const SESSION_ROLE_STORAGE_KEY = "rp.session.role";

export function normalizeSessionRole(role: string | null | undefined): SessionRole | null {
  return role === "CUSTOMER" || role === "EXPERT" ? role : null;
}

export function getRouteSessionRole(pathname: string): SessionRole | null {
  if (pathname.startsWith("/customer")) return "CUSTOMER";
  if (pathname.startsWith("/expert")) return "EXPERT";
  return null;
}

export function readCachedSessionRole(): SessionRole | null {
  if (typeof window === "undefined") return null;

  try {
    return normalizeSessionRole(window.localStorage.getItem(SESSION_ROLE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeCachedSessionRole(role: SessionRole | null): void {
  if (typeof window === "undefined") return;

  try {
    if (role) {
      window.localStorage.setItem(SESSION_ROLE_STORAGE_KEY, role);
    } else {
      window.localStorage.removeItem(SESSION_ROLE_STORAGE_KEY);
    }
  } catch {
  }
}