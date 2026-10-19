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
  description?: string;
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
  triggerClassName?: string;
  disabled?: boolean;
}

/** Кнопка с выпадающим списком действий; закрывается по выбору, Escape и щелчку снаружи. */
export function ActionMenu({
  label,
  actions,
  trigger,
  triggerClassName,
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
        className={cn(styles.trigger, triggerClassName, {
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
              <MenuItemText action={action} />
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
              <MenuItemText action={action} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Пункт меню из выбранного действия. */
interface MenuItemTextProps {
  action: MenuAction;
}

/** Название пункта и пояснение под ним, если оно есть. */
function MenuItemText({ action }: MenuItemTextProps) {
  if (!action.description) {
    return action.label;
  }

  return (
    <span className={styles.text}>
      <span>{action.label}</span>
      <span className={styles.description}>{action.description}</span>
    </span>
  );
}
