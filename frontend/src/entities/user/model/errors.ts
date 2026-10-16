import type { UserRole } from "./types";

/** Просит выбрать один из аккаунтов с одинаковыми данными входа. */
export class RoleChoiceRequiredError extends Error {
  readonly roles: UserRole[];

  constructor(roles: UserRole[]) {
    super("Выберите роль для входа");
    this.name = "RoleChoiceRequiredError";
    this.roles = roles;
  }
}

/** Передаёт адрес и роль для подтверждения почты. */
export class EmailNotVerifiedError extends Error {
  readonly email: string;
  readonly role: UserRole | null;

  constructor(email: string, role: UserRole | null) {
    super("Подтвердите почту");
    this.name = "EmailNotVerifiedError";
    this.email = email;
    this.role = role;
  }
}
