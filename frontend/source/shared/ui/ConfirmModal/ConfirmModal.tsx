"use client";

import Button from "@/source/shared/ui/Button";
import { Modal } from "@/source/shared/ui/Modal/Modal";
import s from "./ConfirmModal.module.scss";

interface Props {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  danger = false,
  isBusy = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} size="sm" isBusy={isBusy} ariaLabel={title}>
      <div className={s.confirm}>
        <h3 className={s.title}>{title}</h3>
        {message && <p className={s.message}>{message}</p>}
        <div className={s.actions}>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isBusy}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} size="md" onClick={onConfirm} isLoading={isBusy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
