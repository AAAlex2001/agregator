"use client";

import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import s from "./CabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "posts" | "chat" | "menu" | "license-holders";

export interface CabinetMenuItem {
  key: CabinetMenuKey;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
}

interface CabinetMenuTabsViewProps {
  items: CabinetMenuItem[];
  activeKey: CabinetMenuKey | null;
}

/** Нижняя панель кабинета: ссылки на разделы и кнопки «Меню» и «Держатели». */
export function CabinetMenuTabsView({ items, activeKey }: CabinetMenuTabsViewProps) {
  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <nav className={s.menuTabs} aria-label="Навигация кабинета">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const className = cn(s.tab, { [s.tabActive]: isActive });
          const content = (
            <>
              <span className={s.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={s.text}>{item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className={className}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              className={className}
              onClick={item.onClick}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </>
  );
}
