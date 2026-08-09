"use client";

import { Modal } from "@/source/shared/ui/Modal";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import { RoleBadge } from "@/source/shared/ui/RoleBadge";
import type { SessionRoleValue } from "@/source/features/session";
import s from "./RoleSwitchPasswordModal.module.scss";

interface Props {
  targetRole: SessionRoleValue | null;
  password: string;
  onPasswordChange: (next: string) => void;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function RoleSwitchPasswordModal({
  targetRole,
  password,
  onPasswordChange,
  submitting,
  error,
  onClose,
  onSubmit,
}: Props) {
  if (!targetRole) return null;

  return (
    <Modal open isBusy={submitting} onClose={onClose} size="sm" ariaLabel="Подтверждение роли">
      <h2 className={s.title}>Войти в другую роль</h2>
      <RoleBadge role={targetRole} className={s.badge} />
      <p className={s.hint}>Введите пароль от этой роли — мы переключим сессию.</p>

      <PasswordInput
        id="role-switch-password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        placeholder="Пароль"
        autoComplete="current-password"
        error={error ?? undefined}
      />

      <div className={s.actions}>
        <Button
          variant="transparent"
          size="md"
          fullWidth
          onClick={onClose}
          disabled={submitting}
        >
          Отмена
        </Button>
        <Button
          variant="chat"
          size="md"
          fullWidth
          onClick={onSubmit}
          isLoading={submitting}
          disabled={password.length === 0}
        >
          Войти
        </Button>
      </div>
    </Modal>
  );
}
