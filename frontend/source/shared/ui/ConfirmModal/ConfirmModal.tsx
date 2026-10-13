"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { Modal } from "@/source/shared/ui/Modal";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

/** Подтверждение необратимого действия. Пока действие выполняется, окно не закрыть; ошибка показывается уведомлением. */
export function ConfirmModal({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  const { showError } = useNotifications();
  const [isBusy, setIsBusy] = useState(false);

  const confirm = async () => {
    setIsBusy(true);
    try {
      await onConfirm();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось выполнить действие");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onCancel} size="sm" isBusy={isBusy} ariaLabelledBy="confirm-modal-title">
      <h2 id="confirm-modal-title" className={s.title}>
        {title}
      </h2>
      <p className={s.desc}>{description}</p>
      <div className={s.buttons}>
        <Button variant="chat" fullWidth onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="danger" fullWidth onClick={confirm} isLoading={isBusy}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
