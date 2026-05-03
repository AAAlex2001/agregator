import type { OrderApiItem, OrderCardData, BadgeVariant } from "./types";
import { resolveFileUrls } from "@/source/shared/lib/fileUrl";

const VARIANT_MAP: Record<string, BadgeVariant> = {
  BLUE: "blue", GREEN: "green", GRAY: "gray",
  ORANGE: "orange", BROWN: "brown", PURPLE: "purple",
  blue: "blue", green: "green", gray: "gray",
  orange: "orange", brown: "brown", purple: "purple",
};

function normalizeCurrency(value: string): string {
  return value.replace(/\s*₽$/, "\u00A0₽");
}

function toIsoDate(displayDate: string): string {
  const match = displayDate.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return displayDate;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function mapApiToOrderCard(item: OrderApiItem): OrderCardData {
  return {
    id:                  item.id,
    publicId:            item.public_id,
    title:               item.title,
    customer:            item.company || item.customer_name,
    company:             item.company,
    comment:             item.comment,
    date:                item.date,
    deadlineRaw:         toIsoDate(item.date),
    sum:                 normalizeCurrency(item.sum),
    sumAmountRaw:        item.sum_amount_raw,
    responsesDeadline:   item.responses_deadline ?? null,
    technicalFiles:      resolveFileUrls(item.technical_files ?? []),
    badges:              item.badges.map((b) => ({
      text: b.text,
      variant: VARIANT_MAP[b.variant] ?? "blue",
    })),
    badgesRaw:           item.badges,
    status:              item.status,
    assignedExpertName:  item.assigned_expert_name ?? "",
  };
}
