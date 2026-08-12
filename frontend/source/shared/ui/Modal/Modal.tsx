"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./Modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Если true — модалка не закрывается по Escape/клику бэкдропа (например идёт submit). */
  isBusy?: boolean;
  /** Ширина диалога. По умолчанию 480. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Шторка снизу вместо центрированного окна. */
  variant?: "center" | "sheet";
  /** ID элемента-заголовка для aria-labelledby. */
  ariaLabelledBy?: string;
  ariaLabel?: string;
  /** Класс на контейнер диалога (для кастомных стилей контента). */
  dialogClassName?: string;
  /** Скрыть стандартную кнопку закрытия (нужно если рендерится своя). */
  hideCloseButton?: boolean;
  children: ReactNode;
}

const SIZE_CLASS: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: s.sizeSm,
  md: s.sizeMd,
  lg: s.sizeLg,
  xl: s.sizeXl,
};

export function Modal({
  open,
  onClose,
  isBusy = false,
  size = "md",
  variant = "center",
  ariaLabelledBy,
  ariaLabel,
  dialogClassName,
  hideCloseButton = false,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const hostClass = variant === "sheet" ? `${s.host} ${s.hostSheet}` : s.host;
  const cardClass = [s.card, SIZE_CLASS[size], dialogClassName].filter(Boolean).join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={hostClass}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      onCancel={(event) => {
        event.preventDefault();
        if (!isBusy) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !isBusy) onClose();
      }}
    >
      <div className={cardClass}>
        {!hideCloseButton && (
          <button
            type="button"
            className={s.closeButton}
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
