"use client";

import cn from "classnames";
import { useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./Tooltip.module.scss";

interface ToolTipProps {
  message: string;
  ariaLabel?: string;
  side?: "right" | "bottom";
  children?: ReactNode;
  hideOnMobile?: boolean;
}

export default function ToolTip({
  message,
  ariaLabel = "Подсказка по прокрутке карточек",
  side = "right",
  children,
  hideOnMobile = false,
}: ToolTipProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpenPathname(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape") {
      setOpenPathname(null);
    }
  };

  return (
    <span
      ref={rootRef}
      className={cn(
        styles.toolTip,
        side === "bottom" ? styles.bottom : styles.right,
        { [styles.hideOnMobile]: hideOnMobile },
      )}
      onPointerEnter={() => setOpenPathname(pathname)}
      onPointerLeave={() => setOpenPathname(null)}
      onFocusCapture={() => setOpenPathname(pathname)}
      onBlurCapture={handleBlur}
      onClickCapture={() => setOpenPathname(null)}
      onKeyDownCapture={handleKeyDown}
    >
      {children ?? (
        <button type="button" className={styles.infoButton} aria-label={ariaLabel}>
          <span className={styles.infoLabel}>i</span>
        </button>
      )}
      <span
        className={cn(styles.hintTooltip, { [styles.hintTooltipVisible]: isOpen })}
        role="tooltip"
        aria-hidden={!isOpen}
      >
        {message}
      </span>
    </span>
  );
}
