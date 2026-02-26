import type { RegistrationFormData, RegistrationResponse } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function registerUser(data: RegistrationFormData): Promise<RegistrationResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const payload = {
    role: data.role,
    email: data.login.includes("@") ? data.login : undefined,
    phone: !data.login.includes("@") ? data.login : undefined,
    password: data.password,
    first_name: data.firstName || undefined,
    last_name: data.lastName || undefined,
  };

  const response = await fetch(`${apiBaseUrl}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Ошибка регистрации" }));
    throw new Error(error.detail || "Ошибка регистрации");
  }

  return response.json();
}
