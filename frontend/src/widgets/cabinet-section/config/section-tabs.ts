import type { UserRole } from "@/entities/user";

/** Ссылка на страницу внутри раздела кабинета. */
interface SectionTab {
  href: string;
  label: string;
}

/** Страницы заказов и отчётов для заказчика. */
const CUSTOMER_ORDER_TABS: SectionTab[] = [
  {
    href: "/customer/orders",
    label: "Все заказы",
  },
  {
    href: "/responses",
    label: "Отклики",
  },
  {
    href: "/customer/orders/new",
    label: "Создать заказ",
  },
  {
    href: "/archive",
    label: "Архивные заказы",
  },
  {
    href: "/customer/reports",
    label: "Отчёты",
  },
];

/** Страницы заказов, собственных откликов и архива для исполнителя. */
const EXPERT_ORDER_TABS: SectionTab[] = [
  {
    href: "/expert/orders",
    label: "Все заказы",
  },
  {
    href: "/responses",
    label: "Мои отклики",
  },
  {
    href: "/archive",
    label: "Архивные заказы",
  },
];

/** Общение заказчика с участниками его заказов. */
const CUSTOMER_CHAT_TABS: SectionTab[] = [
  {
    href: "/chat",
    label: "Чаты по заказам",
  },
];

/** Чаты по заказам и общий чат исполнителей. */
const EXPERT_CHAT_TABS: SectionTab[] = [
  {
    href: "/chat",
    label: "Чаты по заказам",
  },
  {
    href: "/expert/room",
    label: "Чат исполнителей",
  },
];

/** Выбирает вкладки заказов или чатов по роли и текущей странице. */
export function getSectionTabs(
  pathname: string,
  role: UserRole | null,
  ordersHref: string,
): SectionTab[] {
  if (role !== "EXPERT" && role !== "CUSTOMER") {
    return [];
  }

  const isExpert = role === "EXPERT";
  const isChatPage = pathname.startsWith("/chat") || pathname === "/expert/room";

  if (isChatPage) {
    return isExpert ? EXPERT_CHAT_TABS : CUSTOMER_CHAT_TABS;
  }

  const tabs = isExpert ? EXPERT_ORDER_TABS : CUSTOMER_ORDER_TABS;
  const isOrderPage =
    pathname.startsWith(ordersHref) ||
    tabs.some((tab) => tab.href === pathname);

  return isOrderPage ? tabs : [];
}
