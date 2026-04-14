import type { RegisterFormData, UserRole } from "./types";

export function validateRegisterForm(data: RegisterFormData): string | null {
  if (!data.login.trim()) return "Укажите email или телефон";

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
