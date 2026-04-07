import { updateProfile, changePassword } from "./api";
import type { UserProfile } from "./types";

interface SaveProfileParams {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export async function handleSaveProfile(
  params: SaveProfileParams,
  onSuccess: (profile: UserProfile) => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    const updated = await updateProfile({
      first_name: params.firstName,
      last_name: params.lastName,
      phone: params.phone || undefined,
      email: params.email || undefined,
    });
    onSuccess(updated);

    if (params.password) {
      if (params.password !== params.repeatPassword) {
        onError("Пароли не совпадают");
        return;
      }
      if (params.password.length < 8) {
        onError("Пароль должен быть не менее 8 символов");
        return;
      }
      await changePassword(params.password, params.repeatPassword);
    }
  } catch (err) {
    onError(err instanceof Error ? err.message : "Ошибка сохранения");
  }
}
