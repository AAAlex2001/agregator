"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/source/shared/ui/Button";
import { OtpCodeInput } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { confirmEmailCode } from "@/source/shared/api/emailVerification";
import type { UserRole } from "@/source/entities/user";
import s from "./confirm-code-form.module.scss";

interface Props {
  email: string;
  role: UserRole;
  onSuccess?: () => void;
}

export function ConfirmCodeForm({ email, role, onSuccess }: Props) {
  const router = useRouter();
  const { reload } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [code, setCode] = useState("");
  const [waiting, setWaiting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setWaiting(true);
    try {
      await confirmEmailCode(email, code.trim(), role);
      await reload();
      showSuccess("Почта подтверждена");
      onSuccess?.();
      router.push(role === "LICENSE_HOLDER" ? "/settings" : "/landing");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Неверный код");
      setWaiting(false);
    }
  };

  return (
    <div className={s.stepContent}>
      <p className={s.stepText}>Введите код, отправленный на почту</p>
      {email && <p className={s.emailHint}>Письмо отправлено на <span>{email}</span></p>}
      <form onSubmit={submit} className={s.form}>
        <OtpCodeInput value={code} onChange={setCode} autoFocus />
        <p className={s.helperText}>Если код отсутствует, проверьте папку «Спам»</p>
        <Button type="submit" variant="primary" fullWidth isLoading={waiting}>
          Подтвердить код
        </Button>
      </form>
    </div>
  );
}
