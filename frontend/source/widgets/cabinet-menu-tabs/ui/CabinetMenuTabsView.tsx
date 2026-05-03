"use client";

import Link from "next/link";
import {
  ReviewIcon,
  TabOrdersIcon,
  TabResponsesIcon,
  TabChatIcon,
  TabProfileIcon,
  TabArchiveIcon,
} from "@/source/shared/ui/icons";
import s from "./CabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "responses" | "reviews" | "chat" | "profile" | "archive";

interface CabinetMenuItem {
  key: CabinetMenuKey;
  label: string;
  href: string;
}

interface CabinetMenuTabsViewProps {
  items: CabinetMenuItem[];
  activeKey: CabinetMenuKey | null;
}

function renderIcon(key: CabinetMenuKey) {
  if (key === "orders") return <TabOrdersIcon />;
  if (key === "responses") return <TabResponsesIcon />;
  if (key === "reviews") return <ReviewIcon />;
  if (key === "chat") return <TabChatIcon />;
  if (key === "archive") return <TabArchiveIcon />;
  return <TabProfileIcon />;
}

export function CabinetMenuTabsView({ items, activeKey }: CabinetMenuTabsViewProps) {
  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <nav className={s.menuTabs} aria-label="Навигация кабинета">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`${s.tab} ${isActive ? s.tabActive : ""}`.trim()}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={s.icon}>{renderIcon(item.key)}</span>
              <span className={s.text}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
