"use client";

import { Button } from "@/shared/ui/button";
import { EmailInput } from "@/shared/ui/email-input";
import { Modal } from "@/shared/ui/modal";
import { OtpCodeInput } from "@/shared/ui/otp-code-input";
import { EMAIL_CHANGE_CODE_LENGTH } from "../../model/types";
import type { ChangeEmailForm } from "../../model/types";
import styles from "./style.module.scss";

/** Форма смены почты и текущий адрес профиля. */
interface ChangeEmailDialogProps {
  form: ChangeEmailForm;
  currentEmail: string | null;
}

/** Показывает новый адрес, а после отправки письма — поле кода. */
export function ChangeEmailDialog({ form, currentEmail }: ChangeEmailDialogProps) {
  const { state, isPending } = form;
  const isCodeStep = state.step === "code";

  return (
    <Modal
      open={state.step !== "closed"}
      onClose={form.close}
      isBusy={isPending}
      size="sm"
      ariaLabel="Смена почты"
    >
      <h2 className={styles.title}>Смена email</h2>

      {isCodeStep ? (
        <>
          <p className={styles.hint}>Код отправлен на {state.email}</p>
          <OtpCodeInput
            value={state.code}
            onChange={form.changeCode}
            error={Boolean(state.error)}
            autoFocus
          />
          {state.error && <p className={styles.error}>{state.error}</p>}
        </>
      ) : (
        <>
          {currentEmail && (
            <p className={styles.hint}>Текущий: {currentEmail}</p>
          )}
          <EmailInput
            id="change-email-new"
            value={state.email}
            onChange={(event) => form.changeEmail(event.target.value)}
            placeholder="Новый email"
            error={state.error ?? undefined}
          />
          <p className={styles.note}>
            Мы отправим код подтверждения на новый адрес.
          </p>
        </>
      )}

      <div className={styles.actions}>
        <Button
          variant="transparent"
          size="md"
          fullWidth
          onClick={form.close}
          disabled={isPending}
        >
          Отмена
        </Button>
        <Button
          variant="chat"
          size="md"
          fullWidth
          isLoading={isPending}
          disabled={
            isCodeStep
              ? state.code.length < EMAIL_CHANGE_CODE_LENGTH
              : !state.email.trim()
          }
          onClick={isCodeStep ? form.confirm : form.sendCode}
        >
          {isCodeStep ? "Подтвердить" : "Отправить код"}
        </Button>
      </div>
    </Modal>
  );
}
