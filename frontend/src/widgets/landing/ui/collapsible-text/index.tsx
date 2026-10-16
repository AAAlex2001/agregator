"use client";

import cn from "classnames";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Доступное название, оформление и полный текст информационного блока. */
interface CollapsibleTextProps {
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}

/** Раскрывает длинный текст, сохраняя всё содержимое в серверном HTML. */
export function CollapsibleText({
  ariaLabel,
  className,
  children,
}: CollapsibleTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Переключает высоту текста между кратким и полным просмотром. */
  function toggle() {
    setIsOpen((current) => !current);
  }

  return (
    <section
      className={cn(styles.section, className)}
      aria-label={ariaLabel}
    >
      <div className={styles.inner}>
        <div
          className={cn(styles.content, {
            [styles.open]: isOpen,
          })}
        >
          {children}
        </div>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isOpen}
          onClick={toggle}
        >
          {isOpen ? "Свернуть" : "Читать далее"}
        </button>
      </div>
    </section>
  );
}
