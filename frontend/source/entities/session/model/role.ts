import type { UserRole } from "@/source/entities/user";

const COOKIE = "user_role";
const MONTH_IN_SECONDS = 2592000;

/** Роль из произвольной строки или null, если это не роль. */
export function toUserRole(value: string | null | undefined): UserRole | null {
  return value === "CUSTOMER" || value === "EXPERT" || value === "LICENSE_HOLDER" ? value : null;
}

/** Роль, запомненная в cookie с прошлого визита: нужна, чтобы кабинет рисовался до загрузки профиля. */
export function readRoleCookie(): UserRole | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )user_role=([^;]+)/);
  return toUserRole(match ? decodeURIComponent(match[1]) : null);
}

/** Запомнить роль в cookie или стереть её после выхода. */
export function writeRoleCookie(role: UserRole | null): void {
  document.cookie = role
    ? `${COOKIE}=${encodeURIComponent(role)}; Max-Age=${MONTH_IN_SECONDS}; Path=/; SameSite=Lax`
    : `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/** Роль, которую однозначно задаёт адрес страницы кабинета. */
export function roleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith("/customer")) return "CUSTOMER";
  if (pathname === "/expert/reviews" || pathname === "/expert/orders" || pathname.startsWith("/expert/orders/")) {
    return "EXPERT";
  }
  return null;
}

/** Лента заказов для роли; гостю и лицензиату — публичная. */
export function ordersPath(role: UserRole | null): string {
  if (role === "EXPERT") return "/expert/orders";
  if (role === "CUSTOMER") return "/customer/orders";
  return "/orders";
}

/** Стартовая страница кабинета для роли. */
export function homePath(role: UserRole): string {
  if (role === "EXPERT") return "/expert/orders";
  if (role === "LICENSE_HOLDER") return "/settings";
  return "/customer/orders";
}
