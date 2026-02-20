import type { LoginFormData, LoginResponse } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

function splitLogin(login: string): { email?: string; phone?: string } {
  const value = login.trim();
  if (!value) return {};
  if (value.includes("@")) return { email: value };
  return { phone: value };
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const payload = {
    ...splitLogin(data.login),
    password: data.password,
  };

  const response = await fetch(`${apiBaseUrl}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Ошибка входа";
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody?.detail) message = errorBody.detail;
    } catch {
    }
    throw new Error(message);
  }

  return (await response.json()) as LoginResponse;
}
