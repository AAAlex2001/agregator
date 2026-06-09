"use client";

import { API_URL } from "@/source/shared/api/config";

const WS_URL_OVERRIDE = process.env.NEXT_PUBLIC_WS_URL;

export function buildWebSocketUrl(endpoint: string): string {
  if (WS_URL_OVERRIDE) {
    return `${WS_URL_OVERRIDE.replace(/\/$/, "")}${endpoint}`;
  }

  if (/^https?:\/\//i.test(API_URL)) {
    const wsBase = API_URL.replace(/\/$/, "")
      .replace(/^http:\/\//i, "ws://")
      .replace(/^https:\/\//i, "wss://");
    return `${wsBase}${endpoint}`;
  }

  if (typeof window === "undefined") {
    return "";
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const apiPath = API_URL.startsWith("/") ? API_URL : "/api";
  return `${protocol}//${window.location.host}${apiPath}${endpoint}`;
}
