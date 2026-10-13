import type { UserProfile, UserRole } from "@/source/entities/user";
import { API_URL } from "@/source/shared/api/config";
import { extractErrorMessage } from "@/source/shared/api/errorMessage";
import { json, send } from "@/source/shared/api/request";
import { fetchWithSession } from "@/source/shared/api/session";
import { EmailNotVerifiedError, RoleChoiceRequiredError } from "../model/errors";
import type { AvailableRole, LoginCredentials, LoginResponse } from "../model/types";

interface LoginErrorBody {
  detail?: string | { code?: string; available_roles?: UserRole[]; email?: string; role?: UserRole };
}

/** Профиль текущего пользователя или null, если сессии нет. */
export async function fetchSessionUser(): Promise<UserProfile | null> {
  const response = await fetchWithSession(`${API_URL}/settings/profile`);
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Не удалось загрузить сессию");
  return response.json();
}

/** Вход по почте и паролю. Если ролей несколько или почта не подтверждена — бросает свою ошибку. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetchWithSession(`${API_URL}/login/`, json("POST", credentials));
  if (response.ok) return response.json();

  const body: LoginErrorBody = await response.json().catch(() => ({}));
  const detail = typeof body.detail === "object" ? body.detail : {};
  if (detail.code === "role_choice_required" && detail.available_roles) {
    throw new RoleChoiceRequiredError(detail.available_roles);
  }
  if (detail.code === "email_not_verified") {
    throw new EmailNotVerifiedError(detail.email ?? credentials.email, detail.role ?? credentials.role ?? null);
  }
  throw new Error(extractErrorMessage(body) ?? "Не удалось войти");
}

/** Выйти. Ошибку сети не показываем: локальная сессия всё равно сбрасывается. */
export async function logout(): Promise<void> {
  await fetchWithSession(`${API_URL}/login/logout`, { method: "POST" }).catch(() => undefined);
}

/** Другие роли на ту же почту, в которые можно переключиться. */
export async function fetchAvailableRoles(): Promise<AvailableRole[]> {
  const response = await send("/login/available-roles", {}, "Не удалось получить список ролей");
  const data: { roles: AvailableRole[] } = await response.json();
  return data.roles;
}

/** Переключить сессию на другую роль — с паролем от неё. */
export async function switchRole(role: UserRole, password: string): Promise<void> {
  await send("/login/switch-role", json("POST", { role, password }), "Не удалось переключить роль");
}
