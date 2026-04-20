"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { CabinetMenuTabsView, type CabinetMenuKey } from "./CabinetMenuTabsView";

export function CabinetMenuTabs() {
  const pathname = usePathname();
  const { role } = useSession();

  if (role === null) {
    return null;
  }

  const isReviewsPage = pathname.startsWith("/expert/reviews");
  const isResponsesPage = pathname === "/responses";
  const currentRole = role;

  const activeKey: CabinetMenuKey = isReviewsPage
    ? "reviews"
    : isResponsesPage
      ? "responses"
      : "orders";

  const items = [
    {
      key: "orders" as const,
      label: "Заказы",
      href: currentRole === "EXPERT" ? "/expert/orders" : "/customer/orders",
    },
    {
      key: "responses" as const,
      label: "Отклики",
      href: "/responses",
    },
    ...(currentRole === "EXPERT"
      ? [{ key: "reviews" as const, label: "Отзывы", href: "/expert/reviews" }]
      : []),
  ];

  return <CabinetMenuTabsView items={items} activeKey={activeKey} />;
}