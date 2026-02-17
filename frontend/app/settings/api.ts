export interface UserProfile {
  id: number;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  rating: number | null;
  review_count: number;
}

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
}

function getCurrentUserId(): number {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("user_id");
    if (stored) {
      const parsed = Number(stored);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return 1;
}

export async function fetchProfile(): Promise<UserProfile> {
  const apiBaseUrl = getApiBaseUrl();
  const userId = getCurrentUserId();

  const response = await fetch(`${apiBaseUrl}/settings/profile`, {
    headers: { "X-User-Id": String(userId) },
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить профиль");
  }

  return response.json();
}

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}): Promise<UserProfile> {
  const apiBaseUrl = getApiBaseUrl();
  const userId = getCurrentUserId();

  const response = await fetch(`${apiBaseUrl}/settings/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сохранить данные");
  }

  return response.json();
}

export async function changePassword(
  newPassword: string,
  newPasswordConfirm: string,
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();
  const userId = getCurrentUserId();

  const response = await fetch(`${apiBaseUrl}/settings/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(userId),
    },
    body: JSON.stringify({
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось сменить пароль");
  }
}
