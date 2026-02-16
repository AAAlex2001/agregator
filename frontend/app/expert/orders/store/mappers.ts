import type { Badge } from "@/app/expert/orders/components/OrderCard";
import type { OrderResponse, OrderCardViewModel } from "./types";

const badgeVariantMap: Record<string, Badge["variant"]> = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  ORANGE: "orange",
  BROWN: "brown",
};

function mapBadgeVariant(value: string): Badge["variant"] {
  return badgeVariantMap[value] ?? "blue";
}

function normalizeSumDisplay(value: string): string {
  return value.replace(/\s*₽$/, "\u00A0₽");
}

export function mapOrderToCardViewModel(order: OrderResponse): OrderCardViewModel {
  return {
    id: order.id,
    title: order.title,
    customer: order.customer_name,
    date: order.date,
    sum: normalizeSumDisplay(order.sum),
    comment: order.comment,
    technicalFiles: order.technical_files || [],
    badges: order.badges.map((badge) => ({
      text: badge.text,
      variant: mapBadgeVariant(badge.variant),
    })),
  };
}
