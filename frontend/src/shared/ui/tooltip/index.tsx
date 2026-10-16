"use client";

import cn from "classnames";
import { useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./style.module.scss";

/** Содержимое подсказки, расположение и элемент, возле которого она появляется. */
interface TooltipProps {
  message: string;
  ariaLabel?: string;
  side?: "right" | "bottom";
  children?: ReactNode;
  hideOnMobile?: boolean;
}

/** Показывает подсказку при наведении и фокусе, скрывает при переходе на другую страницу. */
export function Tooltip({
  message,
  ariaLabel = "Подсказка по прокрутке карточек",
  side = "right",
  children,
  hideOnMobile = false,
}: TooltipProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [openedPathname, setOpenedPathname] = useState<string | null>(null);
  const isOpen = openedPathname === pathname;

  /** Открывает подсказку для текущей страницы. */
  function open() {
    setOpenedPathname(pathname);
  }

  /** Скрывает подсказку после ухода указателя или выбора действия. */
  function close() {
    setOpenedPathname(null);
  }

  /** Скрывает подсказку, когда фокус покидает её содержимое. */
  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    if (!rootRef.current?.contains(event.relatedTarget)) {
      close();
    }
  }

  /** Позволяет закрыть подсказку клавишей Escape. */
  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Escape") {
      close();
    }
  }

  return (
    <span
      ref={rootRef}
      className={cn(styles.toolTip, side === "bottom" ? styles.bottom : styles.right, {
        [styles.hideOnMobile]: hideOnMobile,
      })}
      onPointerEnter={open}
      onPointerLeave={close}
      onFocusCapture={open}
      onBlurCapture={handleBlur}
      onClickCapture={close}
      onKeyDownCapture={handleKeyDown}
    >
      {children ?? (
        <button
          type="button"
          className={styles.infoButton}
          aria-label={ariaLabel}
        >
          <span className={styles.infoLabel}>i</span>
        </button>
      )}
      <span
        className={cn(styles.hintTooltip, {
          [styles.hintTooltipVisible]: isOpen,
        })}
        role="tooltip"
        aria-hidden={!isOpen}
      >
        {message}
      </span>
    </span>
  );
}
