"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import s from "./Modal.module.scss";

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Только самая верхняя (последняя открытая) модалка реагирует на Escape / Tab-trap —
 * иначе при вложенных модалках их обработчики дерутся между собой.
 * Порталы добавляются в body в порядке монтирования, поэтому последний диалог — верхний.
 */
function isTopmostDialog(dialog: HTMLElement | null): boolean {
  if (!dialog) return false;
  const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]');
  return dialogs.length === 0 || dialogs[dialogs.length - 1] === dialog;
}

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
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy && isTopmostDialog(dialogRef.current)) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, isBusy, onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = getFocusable(dialog);
      const target = focusables[0] ?? dialog;
      target.focus();
    }
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      if (!isTopmostDialog(dialogRef.current)) return;
      const focusables = getFocusable(dialogRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [open]);

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
        ref={dialogRef}
        className={dialogClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        tabIndex={-1}
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
