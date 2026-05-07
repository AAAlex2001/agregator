"use client";

import Link from "next/link";
import {
  BurgerHeaderIcon,
  TabChatIcon,
  TabOrdersIcon,
  TabResponsesIcon,
} from "@/source/shared/ui/icons";
import s from "./CabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "responses" | "chat" | "menu";

export interface CabinetMenuItem {
  key: CabinetMenuKey;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface CabinetMenuTabsViewProps {
  items: CabinetMenuItem[];
  activeKey: CabinetMenuKey | null;
}

function renderIcon(key: CabinetMenuKey) {
  if (key === "orders") return <TabOrdersIcon />;
  if (key === "responses") return <TabResponsesIcon />;
  if (key === "chat") return <TabChatIcon />;
  return <BurgerHeaderIcon />;
}

export function CabinetMenuTabsView({ items, activeKey }: CabinetMenuTabsViewProps) {
  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <nav className={s.menuTabs} aria-label="Навигация кабинета">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const className = `${s.tab} ${isActive ? s.tabActive : ""}`.trim();
          const content = (
            <>
              <span className={s.icon}>{renderIcon(item.key)}</span>
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
