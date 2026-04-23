import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import { OtpCodeInput } from "@/source/shared/ui";
import type { RegisterConfirmValues } from "../model/schema";
import s from "./EmailConfirmStep.module.scss";

interface Props {
  form: UseFormReturn<RegisterConfirmValues>;
  email: string;
  isLoading: boolean;
  onSubmit: () => void;
}

export function EmailConfirmStep({ form, email, isLoading, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const code = watch("code");
  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={s.stepContent}>
      <p className={s.stepText}>Введите код, отправленный на почту</p>
      {email && <p className={s.emailHint}>Письмо отправлено на <span>{email}</span></p>}
      <form onSubmit={handleSubmit} className={s.form}>
        <OtpCodeInput
          value={code}
          onChange={(next) => setValue("code", next, { shouldValidate })}
          error={Boolean(formState.errors.code)}
          autoFocus
        />
        <p className={s.helperText}>Если код отсутствует, проверьте папку «Спам»</p>
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Подтвердить код
        </Button>
      </form>
    </div>
  );
}
