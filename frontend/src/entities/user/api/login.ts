import { readResponseError } from "@/shared/api/response-error";
import { API_URL } from "@/shared/config/api";
import { EmailNotVerifiedError, RoleChoiceRequiredError } from "../model/errors";
import { toUserRole } from "../model/role";
import type { LoginCredentials, LoginResponse } from "../model/types";

/** Тело ответа сервера, когда вход требует выбора роли или подтверждения почты. */
interface LoginErrorBody {
  detail?:
    | {
        code?: string;
        available_roles?: string[];
        email?: string;
        role?: string;
      }
    | string;
}

/** Открывает сессию и сообщает, когда нужны выбор роли или подтверждение почты. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // 401 здесь означает неверный пароль, поэтому обновление сессии не требуется.
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).catch(() => {
    throw new Error(
      "Не удалось связаться с сервером. Проверьте подключение к интернету.",
    );
  });

  if (response.ok) {
    return response.json();
  }

  const body: LoginErrorBody | null = await response
    .clone()
    .json()
    .catch(() => null);
  const detail = body && typeof body.detail === "object" ? body.detail : null;

  if (detail?.code === "role_choice_required" && Array.isArray(detail.available_roles)) {
    const roles = detail.available_roles.map(toUserRole).filter((role) => role !== null);

    if (roles.length > 0) {
      throw new RoleChoiceRequiredError(roles);
    }
  }

  if (detail?.code === "email_not_verified") {
    throw new EmailNotVerifiedError(
      detail.email ?? credentials.email,
      toUserRole(detail.role) ?? credentials.role ?? null,
    );
  }

  throw new Error(await readResponseError(response, "Не удалось войти"));
}
