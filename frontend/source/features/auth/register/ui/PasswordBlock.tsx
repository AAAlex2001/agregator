import { PasswordInput } from "@/source/shared/ui/Inputs";
import type { StepProps } from "./types";
import s from "./register-form.module.scss";

const PASSWORD_RULES: Array<{ label: string; test: (pw: string) => boolean }> = [
  { label: "Не менее 6 символов", test: (pw) => pw.length >= 6 },
  { label: "Хотя бы одна заглавная буква (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Хотя бы одна строчная буква (a-z)", test: (pw) => /[a-z]/.test(pw) },
  {
    label: "Только латинские буквы, цифры и спецсимволы",
    test: (pw) => pw.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(pw),
  },
];

export function PasswordBlock({ state, dispatch }: StepProps) {
  return (
    <>
      <PasswordInput
        id="password"
        value={state.password}
        required
        autoComplete="new-password"
        onChange={(e) => dispatch({ type: "set", key: "password", value: e.target.value })}
        placeholder="Пароль"
      />

      <PasswordInput
        id="repeatPassword"
        value={state.confirm}
        required
        autoComplete="new-password"
        onChange={(e) => dispatch({ type: "set", key: "confirm", value: e.target.value })}
        placeholder="Повторите пароль"
      />

      <ul className={s.requirements}>
        {PASSWORD_RULES.map((rule) => (
          <li key={rule.label} className={rule.test(state.password) ? s.met : ""}>
            {rule.label}
          </li>
        ))}
      </ul>
    </>
  );
}
