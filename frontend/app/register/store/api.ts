import type { RegistrationFormData, RegistrationResponse } from "./types";

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
}

export async function registerUser(data: RegistrationFormData): Promise<RegistrationResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const payload = {
    role: data.role,
    email: data.login.includes("@") ? data.login : undefined,
    phone: !data.login.includes("@") ? data.login : undefined,
    password: data.password,
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
