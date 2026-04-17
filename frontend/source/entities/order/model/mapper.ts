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

export function mapApiToOrderCard(item: OrderApiItem): OrderCardData {
  return {
    id:                  item.id,
    publicId:            item.public_id,
    title:               item.title,
    customer:            item.company || item.customer_name,
    company:             item.company,
    typicalNames:        item.typical_names ?? "",
    comment:             item.comment,
    date:                item.date,
    deadlineRaw:         item.date,
    sum:                 normalizeCurrency(item.sum),
    sumAmountRaw:        item.sum_amount_raw,
    commissionAmount:    normalizeCurrency(item.commission_amount),
    commissionAmountRaw: item.commission_amount_raw ?? 0,
    responsesDeadline:   item.responses_deadline ?? null,
    technicalFiles:      resolveFileUrls(item.technical_files ?? []),
    badges:              item.badges.map((b) => ({
      text: b.text,
      variant: VARIANT_MAP[b.variant] ?? "blue",
    })),
    badgesRaw:           item.badges,
    status:              item.status,
  };
}
