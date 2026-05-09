"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/source/shared/ui/Modal";
import { EmailInput } from "@/source/shared/ui/Inputs";
import { OtpCodeInput } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import {
  confirmEmailChange,
  requestEmailChange,
  type UserProfile,
} from "@/source/entities/user";
import s from "./ChangeEmailModal.module.scss";

type Step = "request" | "confirm";

interface Props {
  open: boolean;
  currentEmail: string | null;
  onClose: () => void;
  onChanged: (profile: UserProfile) => void;
}

export function ChangeEmailModal({ open, currentEmail, onClose, onChanged }: Props) {
  const [step, setStep] = useState<Step>("request");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("request");
      setNewEmail("");
      setCode("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleRequest() {
    const trimmed = newEmail.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestEmailChange(trimmed);
      setStep("confirm");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить код");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm() {
    if (code.length < 4 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const profile = await confirmEmailChange(code.trim());
      onChanged(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось подтвердить код");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} isBusy={submitting} size="sm" ariaLabel="Смена почты">
      <h2 className={s.title}>Смена email</h2>

      {step === "request" ? (
        <>
          {currentEmail ? (
            <p className={s.hint}>Текущий: {currentEmail}</p>
          ) : null}
          <EmailInput
            id="change-email-new"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="Новый email"
            error={error ?? undefined}
          />
          <p className={s.note}>Мы отправим код подтверждения на новый адрес.</p>

          <div className={s.actions}>
            <Button variant="transparent" size="md" fullWidth onClick={onClose} disabled={submitting}>
              Отмена
            </Button>
            <Button
              variant="chat"
              size="md"
              fullWidth
              onClick={() => void handleRequest()}
              isLoading={submitting}
              disabled={newEmail.trim().length === 0}
            >
              Отправить код
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className={s.hint}>Код отправлен на {newEmail}</p>
          <OtpCodeInput
            value={code}
            onChange={setCode}
            error={Boolean(error)}
            autoFocus
          />
          {error ? <p className={s.error}>{error}</p> : null}

          <div className={s.actions}>
            <Button variant="transparent" size="md" fullWidth onClick={onClose} disabled={submitting}>
              Отмена
            </Button>
            <Button
              variant="chat"
              size="md"
              fullWidth
              onClick={() => void handleConfirm()}
              isLoading={submitting}
              disabled={code.length < 4}
            >
              Подтвердить
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
