import { API_URL } from "@/source/shared/api/config";
import {
  EmailNotVerifiedError,
  RoleChoiceRequiredError,
  type LoginFormData,
  type LoginResponse,
  type UserRole,
} from "../model/types";

interface ErrorBody {
  detail?:
    | string
    | {
        code?: string;
        message?: string;
        available_roles?: UserRole[];
        email?: string;
        role?: UserRole;
      };
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      role: data.role,
    }),
  });

  if (!res.ok) {
    const body: ErrorBody = await res.json().catch(() => ({}));
    if (
      res.status === 409 &&
      typeof body.detail === "object" &&
      body.detail?.code === "role_choice_required" &&
      Array.isArray(body.detail.available_roles)
    ) {
      throw new RoleChoiceRequiredError(body.detail.available_roles);
    }
    if (
      res.status === 403 &&
      typeof body.detail === "object" &&
      body.detail?.code === "email_not_verified"
    ) {
      throw new EmailNotVerifiedError(
        body.detail.email ?? data.email,
        body.detail.role ?? data.role ?? null,
      );
    }
    const message =
      typeof body.detail === "string"
        ? body.detail
        : typeof body.detail === "object" && typeof body.detail?.message === "string"
          ? body.detail.message
          : `HTTP Error ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}
