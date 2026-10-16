import {
  PASSWORD_MIN_LENGTH,
  PasswordRequirements,
} from "@/entities/user";
import { PasswordInput } from "@/shared/ui/password-input";

/** Пароль и его повтор для подтверждения введённого значения. */
interface PasswordFieldsProps {
  password: string;
  passwordConfirmation: string;
  onPasswordChange: (password: string) => void;
  onConfirmationChange: (password: string) => void;
}

/** Принимает пароль и повтор, показывая требования к паролю. */
export function PasswordFields({
  password,
  passwordConfirmation,
  onPasswordChange,
  onConfirmationChange,
}: PasswordFieldsProps) {
  return (
    <>
      <PasswordInput
        id="register-password"
        value={password}
        required
        minLength={PASSWORD_MIN_LENGTH}
        autoComplete="new-password"
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Пароль"
      />
      <PasswordInput
        id="register-password-repeat"
        value={passwordConfirmation}
        required
        autoComplete="new-password"
        onChange={(event) => onConfirmationChange(event.target.value)}
        placeholder="Повторите пароль"
      />
      <PasswordRequirements password={password} />
    </>
  );
}
