export function getRole(pathname: string): string {
  if (pathname.startsWith("/customer")) return "CUSTOMER";
  if (pathname.startsWith("/expert")) return "EXPERT";
  if (typeof window !== "undefined") return localStorage.getItem("role") || "EXPERT";
  return "EXPERT";
}
