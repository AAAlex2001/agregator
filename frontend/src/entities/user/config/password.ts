/** Минимальная длина, которую проверяет сервер при создании и смене пароля. */
export const PASSWORD_MIN_LENGTH = 6;

/** Подпись требования к паролю и его проверка. */
interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

/** Подсказки формы пароля; проверки соответствуют ограничениям серверного API. */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    label: `Не менее ${PASSWORD_MIN_LENGTH} символов`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    label: "Хотя бы одна заглавная буква (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Хотя бы одна строчная буква (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Только латинские буквы, цифры и спецсимволы",
    test: (password) => /^[A-Za-z0-9!@#$%^&*()\-_+=[\]{}|;:'",.<>?/`~ ]+$/.test(password),
  },
];
