import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import { InnSuggestionsInput } from "./InnSuggestionsInput";
import s from "./CredentialsStep.module.scss";

interface Props {
  selectedRole: number | null;
  lastName: string;
  firstName: string;
  login: string;
  inn: string;
  innQuery: string;
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  onLastNameChange: (v: string) => void;
  onFirstNameChange: (v: string) => void;
  onLoginChange: (v: string) => void;
  onInnChange: (v: string) => void;
  onInnQueryChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRepeatPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function CredentialsStep({
  selectedRole, lastName, firstName, login, inn, innQuery, password, repeatPassword,
  isLoading, onLastNameChange, onFirstNameChange, onLoginChange, onInnChange, onInnQueryChange,
  onPasswordChange, onRepeatPasswordChange, onSubmit,
}: Props) {
  return (
    <div className={s.stepContent}>
      <form onSubmit={onSubmit} className={s.form}>
        {selectedRole === 2 && (
          <>
            <Input id="lastName" variant="text" value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)} placeholder="Фамилия" required />
            <Input id="firstName" variant="text" value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)} placeholder="Имя" required />
          </>
        )}
        <InnSuggestionsInput
          value={inn}
          query={innQuery}
          disabled={isLoading}
          onValueChange={onInnChange}
          onQueryChange={onInnQueryChange}
        />
        <Input id="login" variant="emailOrPhone" value={login}
          onChange={(e) => onLoginChange(e.target.value)} placeholder="Электронная почта или телефон" required />
        <Input id="password" variant="password" value={password}
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />

        <ul className={s.passwordRequirements}>
          <li className={password.length >= 6 ? s.requirementMet : ""}>Не менее 6 символов</li>
          <li className={/[A-Z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна заглавная буква (A-Z)</li>
          <li className={/[a-z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна строчная буква (a-z)</li>
          <li className={password.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(password) ? s.requirementMet : ""}>
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
