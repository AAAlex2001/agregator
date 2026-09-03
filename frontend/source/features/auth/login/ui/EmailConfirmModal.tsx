"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { Modal, OtpCodeInput } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { confirmEmailCode, resendEmailCode } from "@/source/shared/api/emailVerification";
import type { UserRole } from "../model/types";
import s from "./EmailConfirmModal.module.scss";

interface Props {
  email: string;
  role: UserRole | null;
  onClose: () => void;
  onConfirmed: () => void;
}

export function EmailConfirmModal({ email, role, onClose, onConfirmed }: Props) {
  const { showError, showSuccess } = useNotifications();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const submit = async () => {
    if (code.length !== 6) {
      showError("Введите 6-значный код");
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmEmailCode(email, code, role);
      showSuccess("Почта подтверждена");
      onConfirmed();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось подтвердить почту");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    setIsResending(true);
    try {
      await resendEmailCode(email, role);
      showSuccess("Код отправлен повторно");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось отправить код");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="sm" isBusy={isSubmitting} ariaLabelledBy="email-confirm-title">
      <h2 id="email-confirm-title" className={s.title}>Подтвердите почту</h2>
      <p className={s.subtitle}>Письмо с кодом отправлено на:</p>
      <p className={s.email}>{email}</p>

      <OtpCodeInput value={code} onChange={setCode} error={false} autoFocus />

      <Button
        type="button"
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        onClick={submit}
      >
        Подтвердить
      </Button>

      <button
        type="button"
        className={s.resendLink}
        disabled={isResending}
        onClick={resend}
      >
        {isResending ? <Loader size="sm" label="" /> : "Отправить код снова"}
      </button>
    </Modal>
  );
}
