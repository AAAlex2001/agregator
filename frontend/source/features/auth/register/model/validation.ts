import type { RegisterFormData, UserRole } from "./types";
import { isValidInn } from "@/source/shared/lib/inn";
import { isValidRussianPhone } from "@/source/shared/lib/phone";

export function validateRegisterForm(data: RegisterFormData): string | null {
  if (!data.email.trim() && !data.phone.trim()) return "Укажите email или телефон";
  if (!isValidInn(data.inn)) return "Укажите корректный ИНН из 10 или 12 цифр";
  if (data.phone.trim() && !isValidRussianPhone(data.phone)) return "Укажите корректный номер телефона в формате +7-999-999-99-12";

  if (data.role === "EXPERT") {
    if (!data.firstName?.trim()) return "Укажите имя";
    if (!data.lastName?.trim()) return "Укажите фамилию";
  }

  if (data.password.length < 6) return "Пароль должен быть не менее 6 символов";
  if (data.password !== data.repeatPassword) return "Пароли не совпадают";

  return null;
}

export function getRoleType(roleId: number): UserRole {
  return roleId === 1 ? "CUSTOMER" : "EXPERT";
}
