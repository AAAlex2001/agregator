"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useSidebarMobile } from "@/source/widgets/sidebar";
import { CabinetMenuTabsView, type CabinetMenuItem, type CabinetMenuKey } from "./CabinetMenuTabsView";

export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();
  const { open } = useSidebarMobile();

  if (role === null) {
    return null;
  }

  const activeKey: CabinetMenuKey | null =
    pathname.startsWith("/chat") ? "chat" :
    pathname === "/responses" ? "responses" :
    pathname.startsWith("/customer") || pathname.startsWith("/expert/orders") ? "orders" :
    null;

  const items: CabinetMenuItem[] = [
    { key: "menu", label: "Меню", onClick: open },
    {
      key: "orders",
      label: "Заказы",
      href: role === "EXPERT" ? "/expert/orders" : "/customer/orders",
    },
    { key: "responses", label: "Отклики", href: "/responses" },
    { key: "chat", label: "Чат", href: "/chat" },
  ];

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}
