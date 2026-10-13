import type { UserRole } from "@/source/entities/user";

interface SectionTab {
  href: string;
  label: string;
}

/** Возвращает вкладки текущего раздела с учётом роли. */
export function getSectionTabs(pathname: string, role: UserRole | null): SectionTab[] {
  if (role !== "EXPERT" && role !== "CUSTOMER") {
    return [];
  }

  const isChatPage =
    pathname === "/chat" || pathname.startsWith("/chat/") || pathname === "/expert/room";

  if (isChatPage) {
    const tabs = [{ href: "/chat", label: "Чаты по заказам" }];

    if (role === "EXPERT") {
      tabs.push({ href: "/expert/room", label: "Чат исполнителей" });
    }

    return tabs;
  }

  const ordersPath = role === "EXPERT" ? "/expert/orders" : "/customer/orders";
  const isOrdersPage = pathname === ordersPath
    || pathname.startsWith(`${ordersPath}/`)
    || pathname === "/responses"
    || pathname === "/archive"
    || (role === "CUSTOMER" && pathname === "/customer/reports");

  if (!isOrdersPage) {
    return [];
  }

  const responsesLabel = role === "EXPERT" ? "Мои отклики" : "Отклики";
  const tabs = [
    { href: ordersPath, label: "Все заказы" },
    { href: "/responses", label: responsesLabel },
  ];

  if (role === "CUSTOMER") {
    tabs.push({ href: "/customer/orders/new", label: "Создать заказ" });
  }

  tabs.push({ href: "/archive", label: "Архивные заказы" });

  if (role === "CUSTOMER") {
    tabs.push({ href: "/customer/reports", label: "Отчёты" });
  }

  return tabs;
}
