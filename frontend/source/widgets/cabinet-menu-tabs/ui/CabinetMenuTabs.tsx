"use client";

import { usePathname } from "next/navigation";
import { ordersPath, useSession } from "@/source/entities/session";
import {
  BurgerHeaderIcon,
  DiplomaIcon,
  TabChatIcon,
  TabOrdersIcon,
} from "@/source/shared/ui/icons";
import { NewspaperIcon } from "@/source/shared/ui/icons/NewspaperIcon";
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

/** Основные разделы кабинета в нижней панели на телефоне.
 *  Заказы и чаты — заказчику и исполнителю, держатели документов — исполнителю. */
export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();
  const { open } = useSidebarMobile();
  const licenseDrawer = useLicenseHoldersDrawer();

  if (!role) {
    return null;
  }

  const menu: CabinetMenuItem = {
    key: "menu",
    label: "Меню",
    icon: <BurgerHeaderIcon />,
    onClick: open,
  };
  const orders: CabinetMenuItem = {
    key: "orders",
    label: "Заказы",
    icon: <TabOrdersIcon />,
    href: ordersPath(role),
  };
  const posts: CabinetMenuItem = {
    key: "posts",
    label: "Публикации",
    icon: <NewspaperIcon />,
    href: "/posts",
  };
  const chat: CabinetMenuItem = {
    key: "chat",
    label: "Чаты",
    icon: <TabChatIcon />,
    href: "/chat",
  };
  const licenseHolders: CabinetMenuItem = {
    key: "license-holders",
    label: "Держатели",
    icon: <DiplomaIcon size={22} />,
    onClick: () => licenseDrawer.open(),
  };

  let items = [menu, posts];
  if (role === "CUSTOMER") {
    items = [menu, orders, posts, chat];
  }
  if (role === "EXPERT") {
    items = [menu, orders, posts, chat, licenseHolders];
  }

  return <CabinetMenuTabsView items={items} activeKey={activeMenuKey(pathname)} />;
}
