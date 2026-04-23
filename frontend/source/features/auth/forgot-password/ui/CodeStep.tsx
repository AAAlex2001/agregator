import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import { OtpCodeInput } from "@/source/shared/ui";
import type { ForgotCodeValues } from "../model/schema";
import s from "./CodeStep.module.scss";

interface Props {
  form: UseFormReturn<ForgotCodeValues>;
  isLoading: boolean;
  onSubmit: () => void;
}

export function CodeStep({ form, isLoading, onSubmit }: Props) {
  const { watch, setValue, formState } = form;
  const code = watch("code");
  const shouldValidate = formState.isSubmitted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <p className={s.stepText}>Шаг 2. Введите код, отправленный на почту</p>
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
    </>
  );
}
