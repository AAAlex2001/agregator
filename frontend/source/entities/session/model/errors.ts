import type { UserRole } from "@/source/entities/user";

/** На эту почту зарегистрировано несколько ролей — нужно выбрать, под какой входить. */
export class RoleChoiceRequiredError extends Error {
  readonly roles: UserRole[];

  constructor(roles: UserRole[]) {
    super("Выберите роль для входа");
    this.roles = roles;
  }
}

/** Пароль верный, но почта не подтверждена — нужно ввести код из письма. */
export class EmailNotVerifiedError extends Error {
  readonly email: string;
  readonly role: UserRole | null;

  constructor(email: string, role: UserRole | null) {
    super("Подтвердите почту");
    this.email = email;
    this.role = role;
  }
}
