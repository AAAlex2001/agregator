"use client";

import Button from "@/source/shared/ui/Button";
import { Modal, RoleBadge } from "@/source/shared/ui";
import type { UserRole } from "../model/types";
import s from "./RoleChoiceModal.module.scss";

interface Props {
  roles: UserRole[];
  isFinalizing: boolean;
  onChoose: (role: UserRole) => void;
  onClose: () => void;
}

export function RoleChoiceModal({ roles, isFinalizing, onChoose, onClose }: Props) {
  return (
    <Modal
      open
      size="sm"
      onClose={onClose}
      isBusy={isFinalizing}
      ariaLabelledBy="role-choice-title"
    >
      <h2 id="role-choice-title" className={s.title}>
        Под какой ролью войти?
      </h2>
      <p className={s.subtitle}>На эти данные зарегистрировано несколько аккаунтов.</p>

      <div className={s.list}>
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            className={s.option}
            disabled={isFinalizing}
            onClick={() => onChoose(role)}
          >
            <RoleBadge role={role} />
          </button>
        ))}
      </div>

      <Button type="button" variant="outline" fullWidth disabled={isFinalizing} onClick={onClose}>
        Отмена
      </Button>
    </Modal>
  );
}
