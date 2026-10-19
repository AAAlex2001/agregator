"use client";

import cn from "classnames";
import type { ReactNode } from "react";
import { EllipsisIcon } from "@/shared/ui/icons";
import type { MenuAction } from "./model/types";
import { useActionMenu } from "./model/use-action-menu";
import { ActionMenuList } from "./ui/action-menu-list";
import styles from "./style.module.scss";

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
  const {
    rootRef,
    isOpen,
    toggle,
    close,
  } = useActionMenu();

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
        {trigger ?? <EllipsisIcon className={styles.ellipsis} />}
      </button>
      {isOpen && (
        <ActionMenuList
          actions={actions}
          onClose={close}
        />
      )}
    </div>
  );
}

export { useActionMenu } from "./model/use-action-menu";
export { ActionMenuList } from "./ui/action-menu-list";
export type { MenuAction } from "./model/types";
