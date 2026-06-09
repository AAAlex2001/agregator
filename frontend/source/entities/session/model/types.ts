export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface LoginFormData {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  id: number;
  role: UserRole;
  inn: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export class RoleChoiceRequiredError extends Error {
  readonly availableRoles: UserRole[];
  constructor(availableRoles: UserRole[]) {
    super("Выберите роль для входа");
    this.name = "RoleChoiceRequiredError";
    this.availableRoles = availableRoles;
  }
}

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
