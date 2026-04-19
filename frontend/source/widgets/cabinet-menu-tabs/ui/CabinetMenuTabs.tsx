"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { getRouteSessionRole } from "@/source/features/session/model/sessionRole";
import { CabinetMenuTabsView, type CabinetMenuKey } from "./CabinetMenuTabsView";

export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { resolvedRole } = useSession();

  const isResponsesPage = pathname === "/responses";
  const isOrdersPage = pathname.startsWith("/customer") || pathname.startsWith("/expert");
  const isReviewsPage = pathname.startsWith("/expert/reviews");
  const isChatWindow = pathname.startsWith("/chat/");
  const role = getRouteSessionRole(pathname) ?? resolvedRole;

  if ((!isOrdersPage && !isResponsesPage && !isReviewsPage) || isChatWindow || role === null) {
    return null;
  }

  const activeKey: CabinetMenuKey = isReviewsPage
    ? "reviews"
    : isResponsesPage
      ? "responses"
      : "orders";

  const items = [
    {
      key: "orders" as const,
      label: role === "EXPERT" ? "Все заказы" : "Мои заказы",
      href: role === "EXPERT" ? "/expert/orders" : "/customer/orders",
    },
    {
      key: "responses" as const,
      label: "Отклики",
      href: "/responses",
    },
    ...(role === "EXPERT"
      ? [{ key: "reviews" as const, label: "Отзывы", href: "/expert/reviews" }]
      : []),
  ];

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}