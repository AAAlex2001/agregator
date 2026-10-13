"use client";

import cn from "classnames";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  BurgerHeaderIcon,
  DiplomaIcon,
  TabChatIcon,
  TabOrdersIcon,
} from "@/source/shared/ui/icons";
import { NewspaperIcon } from "@/source/shared/ui/icons/NewspaperIcon";
import s from "./CabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "posts" | "chat" | "menu" | "license-holders";

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
  if (key === "posts") return <NewspaperIcon />;
  if (key === "chat") return <TabChatIcon />;
  if (key === "license-holders") return <DiplomaIcon size={22} />;
  return <BurgerHeaderIcon />;
}

export function CabinetMenuTabsView({ items, activeKey }: CabinetMenuTabsViewProps) {
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const root = document.documentElement;
    const updateHeight = () => {
      const height = menu.getBoundingClientRect().height;
      const bottom = Number.parseFloat(getComputedStyle(menu).bottom) || 0;
      // Оставляем место для панели, её нижнего отступа и зазора над ней.
      root.style.setProperty("--cabinet-menu-height", `${height > 0 ? height + bottom + 12 : 0}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(menu);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      root.style.removeProperty("--cabinet-menu-height");
    };
  }, []);

  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <nav ref={menuRef} className={s.menuTabs} aria-label="Навигация кабинета">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const className = cn(s.tab, { [s.tabActive]: isActive });
          const content = (
            <>
              <span className={s.icon} aria-hidden="true">{renderIcon(item.key)}</span>
              <span className={s.text}>{item.key === "license-holders" ? "Держатели" : item.label}</span>
            </>
          );

          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className={className}
                aria-label={item.label}
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
              aria-label={item.label}
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
