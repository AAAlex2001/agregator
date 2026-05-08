export function validatePassword(password: string, repeatPassword: string): string | null {
  if (!password.trim()) return null; // no password change requested
  if (password.length < 8) return "Пароль должен быть не менее 8 символов";
  if (password !== repeatPassword) return "Пароли не совпадают";
  return null;
}
