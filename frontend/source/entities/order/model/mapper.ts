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
    customerId:          item.customer_id,
    title:               item.title,
    customer:            item.company || item.customer_name,
    company:             item.company,
    comment:             item.comment,
    date:                item.date,
    createdAtDisplay:    item.created_at_display ?? "",
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
    executorName:        item.executor_name ?? "",
    executorAvatarUrl:   item.executor_avatar_url ?? null,
    executorRating:      item.executor_rating ?? null,
    executorReviewCount: item.executor_review_count ?? 0,
    executorPublicId:    item.executor_public_id ?? "",
    executorProposedSum: item.executor_proposed_sum ?? "",
    executorProposedDeadline: item.executor_proposed_deadline ?? "",
    executorComment:     item.executor_comment ?? "",
    executorFiles:       resolveFileUrls(item.executor_files ?? []),
    acceptedResponseId:  item.accepted_response_id ?? null,
    customerHasReview:   item.customer_has_review ?? false,
  };
}
