import { loginUser } from "./api";
import type { LoginFormData } from "./types";

export async function handleLogin(
  data: LoginFormData,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    if (!data.login.trim()) {
      throw new Error("Укажите email или телефон");
    }

    if (!data.password.trim()) {
      throw new Error("Введите пароль");
    }

    await loginUser(data);

    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
    if (onError) {
      onError(errorMessage);
    }
    throw err;
  }
}
