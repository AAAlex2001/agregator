import type { LoginFormData, LoginResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

function splitLogin(login: string): { email?: string; phone?: string } {
  const value = login.trim();
  if (!value) return {};
  if (value.includes("@")) return { email: value };
  return { phone: value };
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const payload = {
    ...splitLogin(data.login),
    password: data.password,
  };

  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
