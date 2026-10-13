"use client";

import { VerifiedBadge, type UserProfile } from "@/source/entities/user";
import { OtpCodeInput } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import { EmailInput } from "@/source/shared/ui/Inputs";
import { Modal } from "@/source/shared/ui/Modal";
import { CODE_LENGTH, useChangeEmail } from "../model/useChangeEmail";
import s from "./EmailField.module.scss";

interface EmailFieldProps {
  profile: UserProfile;
}

/** Почта профиля только для чтения и окно смены: новый адрес подтверждается кодом из письма. */
export function EmailField({ profile }: EmailFieldProps) {
  const { state, open, close, changeEmail, changeCode, sendCode, confirm } = useChangeEmail();
  const isCodeStep = state.step === "code";

  return (
    <div className={s.field}>
      <EmailInput id="profile-email" aria-label="Email" value={profile.email ?? ""} onChange={() => undefined} disabled />

      <div className={s.meta}>
        {profile.email_verified && <VerifiedBadge>Почта подтверждена</VerifiedBadge>}
        <button type="button" className={s.change} onClick={open}>
          Изменить почту
        </button>
      </div>

      <Modal open={state.step !== "closed"} onClose={close} isBusy={state.isPending} size="sm" ariaLabel="Смена почты">
        <h2 className={s.title}>Смена email</h2>

        {isCodeStep ? (
          <>
            <p className={s.hint}>Код отправлен на {state.email}</p>
            <OtpCodeInput value={state.code} onChange={changeCode} error={Boolean(state.error)} autoFocus />
            {state.error && <p className={s.error}>{state.error}</p>}
          </>
        ) : (
          <>
            {profile.email && <p className={s.hint}>Текущий: {profile.email}</p>}
            <EmailInput
              id="change-email-new"
              value={state.email}
              onChange={(event) => changeEmail(event.target.value)}
              placeholder="Новый email"
              error={state.error ?? undefined}
            />
            <p className={s.note}>Мы отправим код подтверждения на новый адрес.</p>
          </>
        )}

        <div className={s.actions}>
          <Button variant="transparent" size="md" fullWidth onClick={close} disabled={state.isPending}>
            Отмена
          </Button>
          <Button
            variant="chat"
            size="md"
            fullWidth
            isLoading={state.isPending}
            disabled={isCodeStep ? state.code.length < CODE_LENGTH : !state.email.trim()}
            onClick={isCodeStep ? confirm : sendCode}
          >
            {isCodeStep ? "Подтвердить" : "Отправить код"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
