import { PasswordInput } from "@/source/shared/ui/Inputs";

interface Props {
  password: string;
  repeatPassword: string;
  onChangePassword: (v: string) => void;
  onChangeRepeatPassword: (v: string) => void;
}

export function PasswordFields({
  password,
  repeatPassword,
  onChangePassword,
  onChangeRepeatPassword,
}: Props) {
  return (
    <>
      <PasswordInput
        id="password"
        name="profile-password"
        placeholder="Введите новый пароль"
        aria-label="Пароль"
        autoComplete="new-password"
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
      />
      <PasswordInput
        id="repeatPassword"
        name="profile-password-repeat"
        placeholder="Повторите новый пароль"
        aria-label="Повторите пароль"
        autoComplete="new-password"
        value={repeatPassword}
        onChange={(e) => onChangeRepeatPassword(e.target.value)}
      />
    </>
  );
}
