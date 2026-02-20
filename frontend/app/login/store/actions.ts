import { loginUser } from "./api";
import type { LoginFormData } from "./types";

export async function handleLogin(
  data: LoginFormData,
  onSuccess?: (role: string) => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    if (!data.login.trim()) {
      throw new Error("Укажите email или телефон");
    }

    if (!data.password.trim()) {
      throw new Error("Введите пароль");
    }

    const user = await loginUser(data);

    if (onSuccess) {
      onSuccess(user.role);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
    if (onError) {
      onError(errorMessage);
    }
    throw err;
  }
}
