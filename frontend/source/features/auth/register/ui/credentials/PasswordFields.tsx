import type { UseFormReturn } from "react-hook-form";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import type { RegisterFormValues } from "../../model/schema";
import s from "./PasswordFields.module.scss";

const PASSWORD_RULES: Array<{ label: string; test: (pw: string) => boolean }> = [
  { label: "Не менее 6 символов", test: (pw) => pw.length >= 6 },
  { label: "Хотя бы одна заглавная буква (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Хотя бы одна строчная буква (a-z)", test: (pw) => /[a-z]/.test(pw) },
  {
    label: "Только латинские буквы, цифры и спецсимволы",
    test: (pw) => pw.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(pw),
  },
];

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function PasswordFields({ form }: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;
  const password = watch("password");

  return (
    <>
      <PasswordInput
        id="password"
        value={password}
        autoComplete="new-password"
        onChange={(e) => setValue("password", e.target.value, { shouldValidate })}
        placeholder="Пароль"
        error={errors.password?.message}
      />

      <PasswordInput
        id="repeatPassword"
        value={watch("repeatPassword")}
        autoComplete="new-password"
        onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate })}
        placeholder="Повторите пароль"
        error={errors.repeatPassword?.message}
      />

      <ul className={s.requirements}>
        {PASSWORD_RULES.map((rule) => (
          <li key={rule.label} className={rule.test(password) ? s.met : ""}>
            {rule.label}
          </li>
        ))}
      </ul>
    </>
  );
}
