/** Контакты, имя, пароль и обязательные согласия новой учётной записи. */
export interface RegistrationAccount {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  personalDataAccepted: boolean;
}

/** Создаёт пустые поля аккаунта при открытии регистрации. */
export function createRegistrationAccount(): RegistrationAccount {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
    privacyAccepted: false,
    termsAccepted: false,
    personalDataAccepted: false,
  };
}

