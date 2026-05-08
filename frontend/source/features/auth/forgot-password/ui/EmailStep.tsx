import type { UseFormReturn } from "react-hook-form";
import { EmailInput } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import type { ForgotEmailValues } from "../model/schema";
import s from "./EmailStep.module.scss";

interface Props {
  form: UseFormReturn<ForgotEmailValues>;
  isLoading: boolean;
  onSubmit: () => void;
}

export function EmailStep({ form, isLoading, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <p className={s.stepText}>Шаг 1. Введите электронную почту</p>
      <form onSubmit={handleSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="forgot-password-email" />
        <EmailInput
          id="email"
          value={watch("email")}
          autoComplete="off"
          onChange={(e) => setValue("email", e.target.value, { shouldValidate })}
          placeholder="Электронная почта"
          error={formState.errors.email?.message}
        />
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Подтвердить
        </Button>
      </form>
    </>
  );
}
