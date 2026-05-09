"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/source/shared/ui/Modal";
import { PasswordInput } from "@/source/shared/ui/Inputs";
import Button from "@/source/shared/ui/Button";
import { RoleBadge } from "@/source/shared/ui/RoleBadge";
import { switchSessionRole, type SessionRoleValue } from "@/source/features/session";
import s from "./RoleSwitchPasswordModal.module.scss";

interface Props {
  open: boolean;
  targetRole: SessionRoleValue | null;
  onClose: () => void;
  onSwitched: (role: SessionRoleValue) => void;
}

export function RoleSwitchPasswordModal({ open, targetRole, onClose, onSwitched }: Props) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!targetRole) return null;

  async function handleSubmit() {
    if (!targetRole || password.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await switchSessionRole(targetRole, password);
      onSwitched(targetRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось переключить роль");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} isBusy={submitting} size="sm" ariaLabel="Подтверждение роли">
      <h2 className={s.title}>Войти в другую роль</h2>
      <RoleBadge role={targetRole} className={s.badge} />
      <p className={s.hint}>Введите пароль от этой роли — мы переключим сессию.</p>

      <PasswordInput
        id="role-switch-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
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
          onClick={() => void handleSubmit()}
          isLoading={submitting}
          disabled={password.length === 0}
        >
          Войти
        </Button>
      </div>
    </Modal>
  );
}
