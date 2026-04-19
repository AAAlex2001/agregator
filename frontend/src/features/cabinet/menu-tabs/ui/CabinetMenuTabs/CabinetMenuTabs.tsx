"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { getRouteSessionRole } from "@/source/features/session/model/sessionRole";
import { MenuOrdersIcon, MenuResponsesIcon, ReviewIcon } from "@/shared/ui/icons";
import styles from "./cabinetMenuTabs.module.scss";

export type CabinetMenuKey = "orders" | "responses" | "reviews";

function renderIcon(key: CabinetMenuKey) {
  if (key === "orders") return <MenuOrdersIcon />;
  if (key === "responses") return <MenuResponsesIcon />;
  return <ReviewIcon width={16} height={16} />;
}

export default function CabinetMenuTabs() {
  const pathname = usePathname();
  const { resolvedRole } = useSession();

  const isCabinetArea = pathname.startsWith("/customer") || pathname.startsWith("/expert");
  const isChatWindow = pathname.startsWith("/chat/");

  const role = getRouteSessionRole(pathname) ?? resolvedRole;

  if (!isCabinetArea || isChatWindow || role === null) {
    return null;
  }

  const activeKey: CabinetMenuKey = pathname.includes("/reviews")
    ? "reviews"
    : pathname.includes("/responses")
      ? "responses"
      : "orders";

  const items = [
    { key: "orders" as const, label: role === "EXPERT" ? "Все заказы" : "Мои заказы", href: role === "EXPERT" ? "/expert/orders" : "/customer/orders" },
    { key: "responses" as const, label: "Отклики", href: "/responses" },
    ...(role === "EXPERT" ? [{ key: "reviews" as const, label: "Отзывы", href: "/expert/reviews" }] : []),
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
