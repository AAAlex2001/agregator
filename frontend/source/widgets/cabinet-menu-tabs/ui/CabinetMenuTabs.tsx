"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/entities/session";
import { useSidebarMobile } from "@/source/widgets/sidebar";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { CabinetMenuTabsView, type CabinetMenuItem, type CabinetMenuKey } from "./CabinetMenuTabsView";

/** Показывает основные разделы кабинета в нижней панели. */
export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();
  const { open } = useSidebarMobile();
  const { isAvailable, open: openLicenseDrawer } = useLicenseHoldersDrawer();

  if (!role) return null;

  let activeKey: CabinetMenuKey | null = null;
  if (pathname.startsWith("/posts")) activeKey = "posts";
  if (pathname.startsWith("/chat") || pathname === "/expert/room") activeKey = "chat";
  if (
    pathname.startsWith("/customer/orders")
    || pathname.startsWith("/customer/reports")
    || pathname.startsWith("/expert/orders")
    || pathname === "/responses"
    || pathname === "/archive"
  ) {
    activeKey = "orders";
  }

  const items: CabinetMenuItem[] = [{ key: "menu", label: "Меню", onClick: open }];

  if (role === "EXPERT" || role === "CUSTOMER") {
    items.push({
      key: "orders",
      label: "Заказы",
      href: role === "EXPERT" ? "/expert/orders" : "/customer/orders",
    });
  }

  items.push({ key: "posts", label: "Публикации", href: "/posts" });

  if (role === "EXPERT" || role === "CUSTOMER") {
    items.push({ key: "chat", label: "Чаты", href: "/chat" });
  }

  if (isAvailable) {
    items.push({
      key: "license-holders",
      label: "Держатели разрешительных документов",
      onClick: () => openLicenseDrawer(),
    });
  }

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}
