"use client";

import cn from "classnames";
import Link from "next/link";
import type { MenuAction } from "../../model/types";
import styles from "./style.module.scss";

/** Пункты меню и закрытие после выбора. */
interface ActionMenuListProps {
  actions: MenuAction[];
  onClose: () => void;
}

/** Выпадающий список действий под кнопкой меню. */
export function ActionMenuList({ actions, onClose }: ActionMenuListProps) {
  /** Закрывает список и выполняет выбранное действие. */
  function runAction(action: MenuAction) {
    onClose();
    action.onClick?.();
  }

  return (
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
          onClick={onClose}
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
