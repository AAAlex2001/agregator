"use client";

import Link from "next/link";
import { MenuOrdersIcon, MenuResponsesIcon, ReviewIcon } from "@/shared/ui/icons";
import s from "./CabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "responses" | "reviews";

interface CabinetMenuItem {
  key: CabinetMenuKey;
  label: string;
  href: string;
}

interface CabinetMenuTabsViewProps {
  items: CabinetMenuItem[];
  activeKey: CabinetMenuKey;
}

function renderIcon(key: CabinetMenuKey) {
  if (key === "orders") return <MenuOrdersIcon />;
  if (key === "responses") return <MenuResponsesIcon />;
  return <ReviewIcon width={16} height={16} />;
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
              className={`${s.tab} ${isActive ? s.tabActive : ""}`}
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