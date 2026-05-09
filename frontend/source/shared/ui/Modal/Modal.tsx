"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./Modal.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Если true — модалка нельзя закрыть по Escape/клику бэкдропа (например идёт submit). */
  isBusy?: boolean;
  /** Ширина диалога. По умолчанию 480. */
  size?: "sm" | "md" | "lg" | "xl";
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
  ariaLabelledBy,
  ariaLabel,
  dialogClassName,
  hideCloseButton = false,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, isBusy, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const handleBackdropClick = () => {
    if (!isBusy) onClose();
  };

  const dialogClass = [s.dialog, SIZE_CLASS[size], dialogClassName].filter(Boolean).join(" ");

  return createPortal(
    <div className={s.backdrop} onClick={handleBackdropClick} role="presentation">
      <div
        className={dialogClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
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
    </div>,
    document.body,
  );
}
