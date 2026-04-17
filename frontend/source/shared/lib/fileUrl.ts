import { API_URL } from "@/source/shared/api/config";

function getApiOrigin(): string | null {
  if (/^https?:\/\//i.test(API_URL)) {
    return new URL(API_URL).origin;
  }

  if (typeof window === "undefined") {
    return null;
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8000";
  }

  return window.location.origin;
}

export function resolveFileUrl(value: string): string {
  if (!value) return value;
  if (/^(blob:|data:|https?:\/\/)/i.test(value)) return value;

  const origin = getApiOrigin();
  if (!origin) return value;

  if (value.startsWith("/")) {
    return `${origin}${value}`;
  }

  return `${origin}/${value}`;
}

export function resolveFileUrls(values: string[]): string[] {
  return values.map(resolveFileUrl);
}