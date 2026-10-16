"use client";

import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";
import { useAuthentication } from "./context";

/** Связывает выбранную роль на странице услуги с общим окном регистрации. */
export function useServiceRegistration() {
  const { openRegistration } = useAuthentication();

  /** Открывает регистрацию с выбранными ролью и направлением услуги. */
  function register(role: UserRole, direction?: DirectionCode) {
    openRegistration({
      role,
      direction,
    });
  }

  return register;
}
