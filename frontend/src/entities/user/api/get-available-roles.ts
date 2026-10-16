import { request } from "@/shared/api/request";
import type { AvailableRole } from "../model/types";

interface AvailableRolesResponse {
  roles: AvailableRole[];
}

/** Загружает роли аккаунтов, зарегистрированных на текущую почту. */
export async function fetchAvailableRoles(): Promise<AvailableRole[]> {
  const response = await request("/login/available-roles", {
    errorMessage: "Не удалось получить список ролей",
  });
  const data: AvailableRolesResponse = await response.json();

  return data.roles;
}
