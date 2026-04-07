import { FormEvent } from "react";
import { Button, Input } from "@/shared/ui";

interface CredentialsStepProps {
  selectedRole: number | null;
  lastName: string;
  firstName: string;
  login: string;
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  onLastNameChange: (v: string) => void;
  onFirstNameChange: (v: string) => void;
  onLoginChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRepeatPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  styles: Record<string, string>;
}

export function CredentialsStep({
  selectedRole,
  lastName,
  firstName,
  login,
  password,
  repeatPassword,
  isLoading,
  onLastNameChange,
  onFirstNameChange,
  onLoginChange,
  onPasswordChange,
  onRepeatPasswordChange,
  onSubmit,
  styles,
}: CredentialsStepProps) {
  return (
    <div className={styles.stepContent} key="step2">
      <form onSubmit={onSubmit} className={styles.form}>
        {selectedRole === 2 && (
          <>
            <Input id="lastName" variant="text" value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)} placeholder="Фамилия" required />
            <Input id="firstName" variant="text" value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)} placeholder="Имя" required />
          </>
        )}
        <Input id="login" variant="emailOrPhone" value={login}
          onChange={(e) => onLoginChange(e.target.value)} placeholder="Электронная почта или телефон" required />
        <Input id="password" variant="password" value={password}
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />

        <ul className={styles.passwordRequirements}>
          <li className={password.length >= 6 ? styles.requirementMet : ""}>Не менее 6 символов</li>
          <li className={/[A-Z]/.test(password) ? styles.requirementMet : ""}>Хотя бы одна заглавная буква (A-Z)</li>
          <li className={/[a-z]/.test(password) ? styles.requirementMet : ""}>Хотя бы одна строчная буква (a-z)</li>
          <li className={password.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(password) ? styles.requirementMet : ""}>
            Только латинские буквы, цифры и спецсимволы
          </li>
        </ul>

        <Input id="repeatPassword" variant="password" value={repeatPassword}
          onChange={(e) => onRepeatPasswordChange(e.target.value)} placeholder="Повторите пароль" required />

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
