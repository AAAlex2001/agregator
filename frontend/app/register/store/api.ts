import type { RegistrationFormData, RegistrationResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export async function registerUser(data: RegistrationFormData): Promise<RegistrationResponse> {
  const payload = {
    role: data.role,
    email: data.login.includes("@") ? data.login : undefined,
    phone: !data.login.includes("@") ? data.login : undefined,
    password: data.password,
  };

  const response = await fetch(`${API_BASE_URL}/register/`, {
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
