"use client";

import cn from "classnames";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./style.module.scss";

/** Содержимое диалога; isBusy запрещает закрытие до окончания действия. */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  isBusy?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "center" | "sheet";
  ariaLabelledBy?: string;
  ariaLabel?: string;
  dialogClassName?: string;
  hideCloseButton?: boolean;
}

/** Класс ширины окна для каждого размера. */
const SIZE_CLASS_NAMES = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

/** Модальное окно; во время отправки формы закрытие блокируется. */
export function Modal({
  open,
  onClose,
  children,
  isBusy = false,
  size = "md",
  variant = "center",
  ariaLabelledBy,
  ariaLabel,
  dialogClassName,
  hideCloseButton = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(styles.host, {
        [styles.hostSheet]: variant === "sheet",
      })}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      onCancel={(event) => {
        event.preventDefault();

        if (!isBusy) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !isBusy) {
          onClose();
        }
      }}
    >
      <div className={cn(styles.card, SIZE_CLASS_NAMES[size], dialogClassName)}>
        {!hideCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
            disabled={isBusy}
          >
            ×
          </button>
        )}

        {children}
      </div>
    </dialog>
  );
}
