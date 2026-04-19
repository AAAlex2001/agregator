import { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import Input from "@/source/shared/ui/Input";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import type { PartySuggestion } from "../api/partySuggestions.api";
import { InnSuggestionsInput } from "./InnSuggestionsInput";
import s from "./CredentialsStep.module.scss";

interface Props {
  selectedRole: number | null;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  inn: string;
  innQuery: string;
  password: string;
  repeatPassword: string;
  isLoading: boolean;
  onLastNameChange: (v: string) => void;
  onFirstNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onInnChange: (v: string) => void;
  onInnQueryChange: (v: string) => void;
  onSuggestionSelect: (suggestion: PartySuggestion | null) => void;
  onPasswordChange: (v: string) => void;
  onRepeatPasswordChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function CredentialsStep({
  selectedRole, lastName, firstName, email, phone, inn, innQuery, password, repeatPassword,
  isLoading, onLastNameChange, onFirstNameChange, onEmailChange, onPhoneChange, onInnChange, onInnQueryChange, onSuggestionSelect,
  onPasswordChange, onRepeatPasswordChange, onSubmit,
}: Props) {
  return (
    <div className={s.stepContent}>
      <form onSubmit={onSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="register" />
        {selectedRole === 2 && (
          <>
            <Input id="lastName" name="register-last-name" variant="text" value={lastName}
              autoComplete="off"
              onChange={(e) => onLastNameChange(e.target.value)} placeholder="Фамилия" required />
            <Input id="firstName" name="register-first-name" variant="text" value={firstName}
              autoComplete="off"
              onChange={(e) => onFirstNameChange(e.target.value)} placeholder="Имя" required />
          </>
        )}
        <InnSuggestionsInput
          value={inn}
          query={innQuery}
          disabled={isLoading}
          onValueChange={onInnChange}
          onQueryChange={onInnQueryChange}
          onSuggestionSelect={onSuggestionSelect}
        />
        <Input id="email" name="register-email" type="email" variant="email" value={email}
          autoComplete="off"
          onChange={(e) => onEmailChange(e.target.value)} placeholder="Электронная почта" />
        <Input id="phone" name="register-phone" type="tel" variant="phone" value={phone}
          autoComplete="off"
          onChange={(e) => onPhoneChange(e.target.value)} placeholder="+7-999-999-99-12" />
        <p className={s.contactHint}>Укажите хотя бы один способ связи: email или телефон</p>
        <Input id="password" name="register-password" variant="password" value={password}
          autoComplete="new-password"
          onChange={(e) => onPasswordChange(e.target.value)} placeholder="Пароль" required />

        <ul className={s.passwordRequirements}>
          <li className={password.length >= 6 ? s.requirementMet : ""}>Не менее 6 символов</li>
          <li className={/[A-Z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна заглавная буква (A-Z)</li>
          <li className={/[a-z]/.test(password) ? s.requirementMet : ""}>Хотя бы одна строчная буква (a-z)</li>
          <li className={password.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(password) ? s.requirementMet : ""}>
            Только латинские буквы, цифры и спецсимволы
          </li>
        </ul>

        <Input id="repeatPassword" name="register-password-repeat" variant="password" value={repeatPassword}
          autoComplete="new-password"
          onChange={(e) => onRepeatPasswordChange(e.target.value)} placeholder="Повторите пароль" required />

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
