"use client";

import cn from "classnames";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { EllipsisIcon } from "./EllipsisIcon";
import { useActionMenu } from "./useActionMenu";
import s from "./ActionMenu.module.scss";

export interface MenuAction {
  label: string;
  icon: ReactNode;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}

interface ActionMenuProps {
  label: string;
  actions: MenuAction[];
  trigger?: ReactNode;
  disabled?: boolean;
}

/** Кнопка с выпадающим списком действий: ссылок или кнопок. После выбора список закрывается. */
export function ActionMenu({ label, actions, trigger, disabled }: ActionMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const menu = useActionMenu(root);

  return (
    <div ref={root} className={s.menu}>
      <button
        type="button"
        className={cn(s.trigger, { [s.square]: !trigger })}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        disabled={disabled}
        onClick={menu.toggle}
      >
        {trigger ?? <EllipsisIcon />}
      </button>
      {menu.open && (
        <div className={s.list} role="menu">
          {actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                role="menuitem"
                className={cn(s.item, { [s.danger]: action.danger })}
                href={action.href}
                onClick={menu.close}
              >
                {action.icon}
                {action.label}
              </Link>
            ) : (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                className={cn(s.item, { [s.danger]: action.danger })}
                onClick={() => {
                  menu.close();
                  action.onClick?.();
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
