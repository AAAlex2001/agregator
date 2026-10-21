/** Страницы, на которых нижняя панель выделяет раздел заказов. */
const ORDER_PAGES = [
  "/customer/orders",
  "/customer/reports",
  "/expert/orders",
  "/responses",
  "/archive",
  "/blitz",
];

/** Определяет активный раздел нижней панели кабинета. */
export function getActiveMenuTab(pathname: string) {
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
