import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";

/** Направление и его описание для посетителя, выбирающего регистрацию. */
export interface RegistrationDirection {
  value: DirectionCode;
  label: string;
  hint: string;
  image: string;
  href: string;
  forCustomer: string;
  forExpert: string;
}

/** Роль и тексты предложения регистрации под статьёй. */
export interface RegistrationRole {
  role: UserRole;
  label: string;
  title: string;
  button: string;
  fine: string;
}
