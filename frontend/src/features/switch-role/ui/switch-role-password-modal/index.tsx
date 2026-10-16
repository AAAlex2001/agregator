"use client";

import { RoleBadge } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { PasswordInput } from "@/shared/ui/password-input";
import styles from "./style.module.scss";

/** Поля формы и состояние переключения для диалога подтверждения роли. */
interface SwitchRolePasswordModalProps {
  role: UserRole;
  password: string;
  error: string | null;
  isSubmitting: boolean;
  canRetryProfile: boolean;
  onPasswordInput: (password: string) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

/** Запрашивает пароль от роли и показывает ошибку переключения. */
export function SwitchRolePasswordModal({
  role,
  password,
  error,
  isSubmitting,
  canRetryProfile,
  onPasswordInput,
  onClose,
  onSubmit,
}: SwitchRolePasswordModalProps) {
  return (
    <Modal
      open
      isBusy={isSubmitting}
      onClose={onClose}
      size="sm"
      ariaLabel="Подтверждение роли"
    >
      <h2 className={styles.title}>Войти в другую роль</h2>
      <RoleBadge
        role={role}
        className={styles.badge}
      />
      <p className={styles.hint}>
        {canRetryProfile
          ? "Роль переключена. Повторите загрузку профиля."
          : "Введите пароль от этой роли — мы переключим сессию."}
      </p>

      <PasswordInput
        id="switch-role-password"
        value={password}
        autoComplete="current-password"
        placeholder="Пароль"
        disabled={isSubmitting || canRetryProfile}
        error={error ?? undefined}
        onChange={(event) => onPasswordInput(event.target.value)}
      />

      <div className={styles.actions}>
        <Button
          variant="transparent"
          size="md"
          fullWidth
          disabled={isSubmitting}
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          variant="chat"
          size="md"
          fullWidth
          isLoading={isSubmitting}
          disabled={!password && !canRetryProfile}
          onClick={() => void onSubmit()}
        >
          {canRetryProfile ? "Повторить загрузку" : "Войти"}
        </Button>
      </div>
    </Modal>
  );
}
