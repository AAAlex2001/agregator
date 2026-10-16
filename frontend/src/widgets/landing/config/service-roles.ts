import type { UserRole } from "@/entities/user";

/** Порядок карточек регистрации: заказчик, исполнитель, держатель документов. */
export const SERVICE_ROLE_ORDER: UserRole[] = [
  "CUSTOMER",
  "EXPERT",
  "LICENSE_HOLDER",
];
