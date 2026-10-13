"use client";

import cn from "classnames";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { EllipsisIcon } from "@/source/entities/posts/ui/icons/ellipsis-icon";
import { useActionMenu } from "../model/useActionMenu";
import s from "./ActionMenu.module.scss";

export interface MenuAction {
  label: string;
  icon?: ReactNode;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}
interface Props {
  actions: MenuAction[];
  label: string;
  trigger?: ReactNode;
  disabled?: boolean;
}

/** Открывает меню действий и закрывает его после выбора или нажатия снаружи. */
export function ActionMenu({ actions, label, trigger, disabled }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const menu = useActionMenu(element);
  return (
    <div
      ref={element}
      className={s.menu}
    >
      <button
        type="button"
        className={cn(s.trigger, !trigger && s.square)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        disabled={disabled}
        onClick={menu.toggle}
      >
        {trigger || <EllipsisIcon />}
      </button>
      {menu.open && (
        <div
          className={s.list}
          role="menu"
        >
          {actions.map((action) => {
            const className = cn(s.item, action.danger && s.danger);
            const content = (
              <>
                {action.icon}
                {action.label}
              </>
            );
            if (action.href)
              return (
                <Link
                  key={action.label}
                  role="menuitem"
                  className={className}
                  href={action.href}
                  onClick={menu.close}
                >
                  {content}
                </Link>
              );
            return (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                className={className}
                onClick={() => {
                  menu.close();
                  action.onClick?.();
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
