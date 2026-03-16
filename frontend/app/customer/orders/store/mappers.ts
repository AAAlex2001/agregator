import type { CustomerOrderResponse, CustomerOrderCardVM } from "./types";

const badgeVariantMap = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  ORANGE: "orange",
  BROWN: "brown",
  PURPLE: "purple",
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
    company: order.company,
    typicalNames: order.typical_names,
    comment: order.comment,
    sumAmountRaw: order.sum_amount_raw,
    deadline: order.date,
    responsesDeadline: order.responses_deadline ?? null,
    technicalFiles: order.technical_files ?? [],
    badgesRaw: order.badges,
  };
}
