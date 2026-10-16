import type { UserRole } from "./types";

/** Проверяет роль, полученную из cookie или ответа сервера. */
export function toUserRole(value: string | null | undefined): UserRole | null {
  if (value === "CUSTOMER" || value === "EXPERT" || value === "LICENSE_HOLDER") {
    return value;
  }

  return null;
}

/** Возвращает ленту заказов для выбранной роли. */
export function ordersPath(role: UserRole | null): string {
  if (role === "EXPERT") {
    return "/expert/orders";
  }

  if (role === "CUSTOMER") {
    return "/customer/orders";
  }

  return "/orders";
}

/** Возвращает стартовую страницу кабинета. */
export function homePath(role: UserRole): string {
  if (role === "LICENSE_HOLDER") {
    return "/settings";
  }

  return ordersPath(role);
}
