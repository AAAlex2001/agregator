"use client";

import { usePathname } from "next/navigation";
import { ordersPath, useSession } from "@/source/entities/session";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { useSidebarMobile } from "@/source/widgets/sidebar";
import {
  CabinetMenuTabsView,
  type CabinetMenuItem,
  type CabinetMenuKey,
} from "./CabinetMenuTabsView";

const ORDER_PAGES = [
  "/customer/orders",
  "/customer/reports",
  "/expert/orders",
  "/responses",
  "/archive",
];

/** Какая вкладка нижней панели подсвечена на этой странице. */
function activeMenuKey(pathname: string): CabinetMenuKey | null {
  if (pathname.startsWith("/posts")) {
    return "posts";
  }

  if (pathname.startsWith("/chat") || pathname === "/expert/room") {
    return "chat";
  }

  if (ORDER_PAGES.some((page) => pathname.startsWith(page))) {
    return "orders";
  }

  return null;
}

/**
 * Основные разделы кабинета в нижней панели на телефоне.
 * Заказы и чаты — только заказчику и исполнителю.
 */
export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();
  const { open } = useSidebarMobile();
  const licenseDrawer = useLicenseHoldersDrawer();

  if (!role) {
    return null;
  }

  const hasOrders = role === "EXPERT" || role === "CUSTOMER";
  const items: CabinetMenuItem[] = [
    {
      key: "menu",
      label: "Меню",
      onClick: open,
    },
  ];

  if (hasOrders) {
    items.push({
      key: "orders",
      label: "Заказы",
      href: ordersPath(role),
    });
  }

  items.push({
    key: "posts",
    label: "Публикации",
    href: "/posts",
  });

  if (hasOrders) {
    items.push({
      key: "chat",
      label: "Чаты",
      href: "/chat",
    });
  }

  if (licenseDrawer.isAvailable) {
    items.push({
      key: "license-holders",
      label: "Держатели разрешительных документов",
      onClick: () => licenseDrawer.open(),
    });
  }

  return <CabinetMenuTabsView items={items} activeKey={activeMenuKey(pathname)} />;
}
