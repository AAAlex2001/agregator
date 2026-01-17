import { registerUser } from "./api";
import type { RegistrationFormData, UserRole } from "./types";

export async function handleRegistration(
  data: RegistrationFormData,
  onSuccess?: (userId: number) => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    // Валидация на фронте
    if (!data.login.trim()) {
      throw new Error("Укажите email или телефон");
    }

    if (data.password.length < 6) {
      throw new Error("Пароль должен быть не менее 6 символов");
    }

    if (data.password !== data.repeatPassword) {
      throw new Error("Пароли не совпадают");
    }

    const response = await registerUser(data);

    if (onSuccess) {
      onSuccess(response.id);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
    if (onError) {
      onError(errorMessage);
    }
    throw err;
  }
}

export function getRoleType(roleId: number): UserRole {
  return roleId === 1 ? "CUSTOMER" : "EXPERT";
}
