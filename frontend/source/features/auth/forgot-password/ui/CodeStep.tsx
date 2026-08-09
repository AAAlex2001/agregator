import type { FormEvent } from "react";
import Button from "@/source/shared/ui/Button";
import { OtpCodeInput } from "@/source/shared/ui";
import s from "./CodeStep.module.scss";

interface Props {
  code: string;
  onCodeChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent) => void;
}

export function CodeStep({ code, onCodeChange, isLoading, onSubmit }: Props) {
  return (
    <>
      <p className={s.stepText}>Шаг 2. Введите код, отправленный на почту</p>
      <form onSubmit={onSubmit} className={s.form}>
        <OtpCodeInput value={code} onChange={onCodeChange} autoFocus />
        <p className={s.helperText}>Если код отсутствует, проверьте папку «Спам»</p>
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Подтвердить код
        </Button>
      </form>
    </>
  );
}
