"use client";

import type { UserRole } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import { Modal } from "@/source/shared/ui/Modal";
import { RoleBadge } from "@/source/shared/ui/RoleBadge";
import s from "./SwitchRolePasswordModal.module.scss";

interface SwitchRolePasswordModalProps {
  role: UserRole;
  password: string;
  error: string | null;
  isSubmitting: boolean;
  onPasswordChange: (password: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** Пароль от роли, в которую переключаемся. */
export function SwitchRolePasswordModal({
  role,
  password,
  error,
  isSubmitting,
  onPasswordChange,
  onClose,
  onSubmit,
}: SwitchRolePasswordModalProps) {
  return (
    <Modal open isBusy={isSubmitting} onClose={onClose} size="sm" ariaLabel="Подтверждение роли">
      <h2 className={s.title}>Войти в другую роль</h2>
      <RoleBadge role={role} className={s.badge} />
      <p className={s.hint}>Введите пароль от этой роли — мы переключим сессию.</p>

      <PasswordInput
        id="switch-role-password"
        value={password}
        autoComplete="current-password"
        placeholder="Пароль"
        error={error ?? undefined}
        onChange={(event) => onPasswordChange(event.target.value)}
      />

      <div className={s.actions}>
        <Button variant="transparent" size="md" fullWidth disabled={isSubmitting} onClick={onClose}>
          Отмена
        </Button>
        <Button variant="chat" size="md" fullWidth isLoading={isSubmitting} disabled={!password} onClick={onSubmit}>
          Войти
        </Button>
      </div>
    </Modal>
  );
}
