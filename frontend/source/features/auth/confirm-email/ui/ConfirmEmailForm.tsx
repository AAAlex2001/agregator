"use client";

import type { UserRole } from "@/source/entities/user";
import { OtpCodeInput } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { useConfirmEmail } from "../model/useConfirmEmail";
import s from "./ConfirmEmailForm.module.scss";

interface ConfirmEmailFormProps {
  email: string;
  role: UserRole | null;
  onConfirmed: () => void;
}

/** Ввод кода из письма: подтверждение почты и повторная отправка кода. */
export function ConfirmEmailForm({ email, role, onConfirmed }: ConfirmEmailFormProps) {
  const { state, changeCode, confirm, resend } = useConfirmEmail(email, role, onConfirmed);

  return (
    <form onSubmit={confirm} className={s.form}>
      <h2 className={s.title}>Подтвердите почту</h2>
      <p className={s.hint}>
        Письмо с кодом отправлено на <span className={s.email}>{email}</span>
      </p>

      <OtpCodeInput value={state.code} onChange={changeCode} autoFocus />
      <p className={s.spam}>Если письма нет, проверьте папку «Спам»</p>

      <Button type="submit" variant="primary" fullWidth isLoading={state.isSubmitting}>
        Подтвердить
      </Button>

      <button type="button" className={s.resend} disabled={state.isResending} onClick={resend}>
        {state.isResending ? <Loader size="sm" label="" /> : "Отправить код снова"}
      </button>
    </form>
  );
}
