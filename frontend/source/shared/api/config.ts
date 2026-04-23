export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
export const SITE_URL = new URL(API_URL, "http://localhost:3000").origin;
export const SERVER_API_URL = process.env.SERVER_API_URL || "http://backend:8000/api";
