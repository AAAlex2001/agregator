import type { UseFormReturn } from "react-hook-form";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import type { ForgotNewPasswordValues } from "../model/schema";
import s from "./NewPasswordStep.module.scss";

interface Props {
  form: UseFormReturn<ForgotNewPasswordValues>;
  isLoading: boolean;
  onSubmit: () => void;
}

export function NewPasswordStep({ form, isLoading, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <p className={s.stepText}>Шаг 3. Создание нового пароля</p>
      <form onSubmit={handleSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-new-password" />
        <Input
          id="password"
          variant="password"
          value={watch("password")}
          autoComplete="new-password"
          onChange={(e) => setValue("password", e.target.value, { shouldValidate })}
          placeholder="Пароль"
          error={formState.errors.password?.message}
        />
        <Input
          id="repeatPassword"
          variant="password"
          value={watch("repeatPassword")}
          autoComplete="new-password"
          onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate })}
          placeholder="Повторите пароль"
          error={formState.errors.repeatPassword?.message}
        />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Сохранить изменения
        </Button>
      </form>
    </>
  );
}
