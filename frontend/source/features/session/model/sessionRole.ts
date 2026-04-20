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

export function writeSessionRoleCookie(role: SessionRole | null) {
  if (typeof document === "undefined") {
    return;
  }

  if (role === null) {
    document.cookie = "user_role=; Max-Age=0; Path=/; SameSite=Lax";
    return;
  }

  document.cookie = `user_role=${encodeURIComponent(role)}; Max-Age=2592000; Path=/; SameSite=Lax`;
}

export function getRouteSessionRole(pathname: string): SessionRole | null {
  if (pathname.startsWith("/customer")) return "CUSTOMER";
  if (pathname === "/expert/reviews") return "EXPERT";
  if (pathname === "/expert/orders" || pathname.startsWith("/expert/orders/")) return "EXPERT";
  return null;
}
