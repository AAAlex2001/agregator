"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useSidebarMobile } from "@/source/widgets/sidebar";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { CabinetMenuTabsView, type CabinetMenuItem, type CabinetMenuKey } from "./CabinetMenuTabsView";

export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();
  const { open } = useSidebarMobile();
  const { isAvailable: licenseDrawerAvailable, open: openLicenseDrawer } =
    useLicenseHoldersDrawer();

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

  if (licenseDrawerAvailable) {
    items.push({ key: "license-holders", label: "Держатели лицензии", onClick: openLicenseDrawer });
  }

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}
