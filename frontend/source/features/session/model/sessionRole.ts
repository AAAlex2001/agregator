import type { SessionRole } from "./types";

export function normalizeSessionRole(role: string | null | undefined): SessionRole | null {
  return role === "CUSTOMER" || role === "EXPERT" ? role : null;
}

export function readSessionRoleFromCookie(): SessionRole | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(/(?:^|; )user_role=([^;]+)/);
  return normalizeSessionRole(match ? decodeURIComponent(match[1]) : null);
}

export function getRouteSessionRole(pathname: string): SessionRole | null {
  if (pathname.startsWith("/customer")) return "CUSTOMER";
  if (pathname.startsWith("/expert")) return "EXPERT";
  return null;
}
