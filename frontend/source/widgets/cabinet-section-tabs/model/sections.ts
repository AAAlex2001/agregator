import { ordersPath } from "@/source/entities/session";
import type { UserRole } from "@/source/entities/user";

interface SectionTab {
  href: string;
  label: string;
}

const CUSTOMER_ORDER_TABS: SectionTab[] = [
  { href: "/customer/orders", label: "Все заказы" },
  { href: "/responses", label: "Отклики" },
  { href: "/customer/orders/new", label: "Создать заказ" },
  { href: "/archive", label: "Архивные заказы" },
  { href: "/customer/reports", label: "Отчёты" },
];

const EXPERT_ORDER_TABS: SectionTab[] = [
  { href: "/expert/orders", label: "Все заказы" },
  { href: "/responses", label: "Мои отклики" },
  { href: "/archive", label: "Архивные заказы" },
];

const CUSTOMER_CHAT_TABS: SectionTab[] = [
  { href: "/chat", label: "Чаты по заказам" },
];

const EXPERT_CHAT_TABS: SectionTab[] = [
  { href: "/chat", label: "Чаты по заказам" },
  { href: "/expert/room", label: "Чат исполнителей" },
];

/** Вкладки раздела «Заказы» или «Чаты» для заказчика и исполнителя; на других страницах — нет. */
export function getSectionTabs(pathname: string, role: UserRole | null): SectionTab[] {
  if (role !== "EXPERT" && role !== "CUSTOMER") {
    return [];
  }

  const isExpert = role === "EXPERT";
  const isChatPage = pathname.startsWith("/chat") || pathname === "/expert/room";
  if (isChatPage) {
    return isExpert ? EXPERT_CHAT_TABS : CUSTOMER_CHAT_TABS;
  }

  const orderTabs = isExpert ? EXPERT_ORDER_TABS : CUSTOMER_ORDER_TABS;
  const isOrderPage =
    pathname.startsWith(ordersPath(role)) || orderTabs.some((tab) => tab.href === pathname);
  return isOrderPage ? orderTabs : [];
}
