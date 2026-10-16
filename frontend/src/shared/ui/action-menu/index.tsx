"use client";

import cn from "classnames";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EllipsisIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Пункт меню: ссылка или кнопка с иконкой. */
export interface MenuAction {
  label: string;
  icon: ReactNode;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}

/** Подпись кнопки, пункты меню и необязательная своя кнопка вместо трёх точек. */
interface ActionMenuProps {
  label: string;
  actions: MenuAction[];
  trigger?: ReactNode;
  disabled?: boolean;
}

/** Кнопка с выпадающим списком действий; закрывается по выбору, Escape и щелчку снаружи. */
export function ActionMenu({
  label,
  actions,
  trigger,
  disabled,
}: ActionMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает меню при нажатии за его пределами. */
    function closeOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    /** Закрывает меню по Escape. */
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  /** Открывает или закрывает список. */
  function toggle() {
    setIsOpen(!isOpen);
  }

  /** Закрывает список и выполняет выбранное действие. */
  function runAction(action: MenuAction) {
    setIsOpen(false);
    action.onClick?.();
  }

  return (
    <div
      ref={rootRef}
      className={styles.menu}
    >
      <button
        type="button"
        className={cn(styles.trigger, {
          [styles.square]: !trigger,
        })}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={toggle}
      >
        {trigger ?? <EllipsisIcon />}
      </button>
      {isOpen && (
        <div
          className={styles.list}
          role="menu"
        >
          {actions.map((action) => action.href ? (
            <Link
              key={action.label}
              role="menuitem"
              className={cn(styles.item, {
                [styles.danger]: action.danger,
              })}
              href={action.href}
              onClick={() => setIsOpen(false)}
            >
              {action.icon}
              {action.label}
            </Link>
          ) : (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={cn(styles.item, {
                [styles.danger]: action.danger,
              })}
              onClick={() => runAction(action)}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
