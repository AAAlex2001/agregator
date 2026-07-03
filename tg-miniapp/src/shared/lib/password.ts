export const PASSWORD_RULES: { label: string; test: (password: string) => boolean }[] = [
  { label: "Не менее 6 символов", test: (password) => password.length >= 6 },
  { label: "Хотя бы одна заглавная буква (A-Z)", test: (password) => /[A-Z]/.test(password) },
  { label: "Хотя бы одна строчная буква (a-z)", test: (password) => /[a-z]/.test(password) },
  { label: "Только латинские буквы, цифры и спецсимволы", test: (password) => /^[\x21-\x7e]*$/.test(password) },
];

export function passwordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
