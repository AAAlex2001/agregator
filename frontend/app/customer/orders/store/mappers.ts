import type { CustomerOrderResponse, CustomerOrderCardVM } from "./types";

export function mapOrderToCustomerCard(
  order: CustomerOrderResponse,
): CustomerOrderCardVM {
  return {
    id: order.id,
    title: order.title,
    company: order.company,
    date: order.date,
    sum: order.sum.replace(/\s*₽$/, "\u00A0₽"),
    badges: order.badges.map((b) => ({
      text: b.text,
      variant: b.variant,
    })),
    status: order.status,
  };
}
