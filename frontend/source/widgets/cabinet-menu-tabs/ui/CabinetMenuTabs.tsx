"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { CabinetMenuTabsView, type CabinetMenuKey } from "./CabinetMenuTabsView";

export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();

  if (role === null) {
    return null;
  }

  const activeKey: CabinetMenuKey | null =
    pathname === "/settings" ? "profile" :
    pathname.startsWith("/chat") ? "chat" :
    pathname.startsWith("/archive") ? "archive" :
    pathname.startsWith("/expert/reviews") ? "reviews" :
    pathname === "/responses" ? "responses" :
    pathname.startsWith("/customer") || pathname.startsWith("/expert") ? "orders" :
    null;

  const items = [
    {
      key: "orders" as const,
      label: "Заказы",
      href: role === "EXPERT" ? "/expert/orders" : "/customer/orders",
    },
    { key: "responses" as const, label: "Отклики", href: "/responses" },
    { key: "archive" as const, label: "Архив", href: "/archive" },
    ...(role === "EXPERT"
      ? [{ key: "reviews" as const, label: "Отзывы", href: "/expert/reviews" }]
      : []),
    { key: "chat" as const, label: "Чат", href: "/chat" },
    { key: "profile" as const, label: "Профиль", href: "/settings" },
  ];

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}
