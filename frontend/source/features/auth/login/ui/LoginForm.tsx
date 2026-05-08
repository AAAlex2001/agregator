import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import { EmailInput, PasswordInput } from "@/source/shared/ui/Inputs";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import type { LoginFormValues } from "../model/schema";
import s from "./LoginForm.module.scss";

interface Props {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  fromOrder: boolean;
  onSubmit: () => void;
}

export function LoginForm({ form, isLoading, fromOrder, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="login" />

      {fromOrder && (
        <p className={s.orderHint}>Войдите как эксперт, чтобы откликнуться на заказ</p>
      )}

      <EmailInput
        id="email"
        value={watch("email")}
        autoComplete="off"
        onChange={(e) => setValue("email", e.target.value, { shouldValidate })}
        placeholder="Электронная почта"
        error={formState.errors.email?.message}
      />
      <PasswordInput
        id="password"
        value={watch("password")}
        autoComplete="new-password"
        onChange={(e) => setValue("password", e.target.value, { shouldValidate })}
        placeholder="Введите пароль"
        error={formState.errors.password?.message}
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        Войти
      </Button>
    </form>
  );
}
