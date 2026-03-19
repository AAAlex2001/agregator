import type { Badge } from "@/app/expert/orders/types";
import type { OrderResponse, OrderCardViewModel } from "./types";

const badgeVariantMap: Record<string, Badge["variant"]> = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  ORANGE: "orange",
  BROWN: "brown",
  PURPLE: "purple",
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
    publicId: order.public_id,
    title: order.title,
    customer: order.customer_name,
    date: order.date,
    deadlineRaw: order.date,
    responsesDeadline: order.responses_deadline ?? null,
    sum: normalizeSumDisplay(order.sum),
    sumAmountRaw: order.sum_amount_raw,
    commissionAmount: normalizeSumDisplay(order.commission_amount),
    commissionAmountRaw: order.commission_amount_raw ?? 0,
    comment: order.comment,
    technicalFiles: order.technical_files || [],
    badges: order.badges.map((badge) => ({
      text: badge.text,
      variant: mapBadgeVariant(badge.variant),
    })),
  };
}
