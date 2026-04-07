import { requestPasswordReset, confirmResetCode, resetPassword } from "./api";

export async function handleEmailStep(
  email: string,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  if (!email.trim()) {
    onError("Введите электронную почту");
    return;
  }

  try {
    await requestPasswordReset(email);
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Произошла ошибка");
  }
}

export async function handleCodeStep(
  email: string,
  code: string,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  if (!code.trim()) {
    onError("Введите код");
    return;
  }

  try {
    await confirmResetCode(email, code);
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Произошла ошибка");
  }
}

export async function handlePasswordStep(
  email: string,
  code: string,
  password: string,
  repeatPassword: string,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  if (!password.trim()) {
    onError("Введите пароль");
    return;
  }
  if (password.length < 6) {
    onError("Пароль должен быть не менее 6 символов");
    return;
  }
  if (password !== repeatPassword) {
    onError("Пароли не совпадают");
    return;
  }

  try {
    await resetPassword(email, code, password);
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Произошла ошибка");
  }
}
