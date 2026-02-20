"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuOrdersIcon, MenuResponsesIcon, ReviewIcon } from "@/app/icons";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import styles from "./cabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "responses" | "reviews";

function renderIcon(key: CabinetMenuKey) {
  if (key === "orders") return <MenuOrdersIcon />;
  if (key === "responses") return <MenuResponsesIcon />;
  return <ReviewIcon width={16} height={16} />;
}

export default function CabinetMenuTabs() {
  const pathname = usePathname();
  const { profile } = useUserProfile();

  const isCabinetArea = pathname.startsWith("/customer") || pathname.startsWith("/expert") || pathname.startsWith("/reviews") || pathname.startsWith("/settings");
  const isChatWindow = /\/(customer|expert)\/chat\/\d+/.test(pathname);

  const resolvedRole: "CUSTOMER" | "EXPERT" | null = useMemo(() => {
    if (pathname.startsWith("/expert")) return "EXPERT";
    if (pathname.startsWith("/customer")) return "CUSTOMER";
    if (profile?.role === "CUSTOMER" || profile?.role === "EXPERT") return profile.role as "CUSTOMER" | "EXPERT";
    return null;
  }, [pathname, profile]);

  if (!isCabinetArea || isChatWindow || resolvedRole === null) {
    return null;
  }

  const activeKey: CabinetMenuKey = pathname.startsWith("/reviews")
    ? "reviews"
    : pathname.includes("/responses")
      ? "responses"
      : "orders";

  const items = [
    { key: "orders" as const, label: resolvedRole === "EXPERT" ? "Все заказы" : "Мои заказы", href: resolvedRole === "EXPERT" ? "/expert/orders" : "/customer/orders" },
    { key: "responses" as const, label: "Отклики", href: resolvedRole === "EXPERT" ? "/expert/responses" : "/customer/responses" },
    { key: "reviews" as const, label: "Отзывы", href: "/reviews" },
  ];

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <nav className={styles.menuTabs} aria-label="Навигация кабинета">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.icon}>{renderIcon(item.key)}</span>
              <span className={styles.text}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
