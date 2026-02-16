import type { CustomerOrderResponse, CustomerOrderCardVM } from "./types";

const badgeVariantMap = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  ORANGE: "orange",
  BROWN: "brown",
} as const;

function mapBadgeVariant(value: string): CustomerOrderCardVM["badges"][number]["variant"] {
  return badgeVariantMap[value as keyof typeof badgeVariantMap] ?? "blue";
}

export function mapOrderToCustomerCard(
  order: CustomerOrderResponse,
): CustomerOrderCardVM {
  return {
    id: order.id,
    title: order.title,
    customer: order.company,
    date: order.date,
    sum: order.sum.replace(/\s*₽$/, "\u00A0₽"),
    badges: order.badges.map((b) => ({
      text: b.text,
      variant: mapBadgeVariant(b.variant),
    })),
    status: order.status,
  };
}
