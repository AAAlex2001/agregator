"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import styles from "./style.module.scss";

/** Текст подтверждения и состояние действия, которым управляет вызывающая форма. */
interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isBusy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Запрашивает подтверждение действия и показывает переданное состояние отправки. */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Отмена",
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      isBusy={isBusy}
      ariaLabelledBy="confirm-modal-title"
    >
      <h2
        id="confirm-modal-title"
        className={styles.title}
      >
        {title}
      </h2>
      <p className={styles.desc}>{description}</p>
      <div className={styles.buttons}>
        <Button
          variant="chat"
          fullWidth
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={onConfirm}
          isLoading={isBusy}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
