import type { OrderApiItem, OrderCardData, OrderDocuments, BadgeVariant } from "./types";
import { emptyDocuments } from "./types";
import { resolveFileUrls } from "@/source/shared/lib/fileUrl";

const VARIANT_MAP: Record<string, BadgeVariant> = {
  BLUE: "blue", GREEN: "green", GRAY: "gray",
  ORANGE: "orange", BROWN: "brown", PURPLE: "purple",
  blue: "blue", green: "green", gray: "gray",
  orange: "orange", brown: "brown", purple: "purple",
};

function normalizeCurrency(value: string): string {
  return value.replace(/\s*₽$/, " ₽");
}

function toIsoDate(displayDate: string): string {
  const match = displayDate.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return displayDate;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function resolveDocuments(documents: OrderDocuments | undefined | null): OrderDocuments {
  if (!documents) return emptyDocuments();
  return {
    technical: resolveFileUrls(documents.technical),
    contract: resolveFileUrls(documents.contract),
    company: resolveFileUrls(documents.company),
    other: resolveFileUrls(documents.other),
  };
}

export function mapApiToOrderCard(item: OrderApiItem): OrderCardData {
  return {
    id:                  item.id,
    publicId:            item.public_id,
    customerId:          item.customer_id,
    title:               item.title,
    customer:            item.company || item.customer_name,
    customerInn:         item.customer_inn ?? "",
    company:             item.company,
    comment:             item.comment,
    startDate:           item.start_date ?? "",
    date:                item.date,
    createdAtDisplay:    item.created_at_display ?? "",
    startDateRaw:        item.start_date ? toIsoDate(item.start_date) : "",
    deadlineRaw:         toIsoDate(item.date),
    sum:                 normalizeCurrency(item.sum),
    sumAmountRaw:        item.sum_amount_raw,
    responsesDeadline:   item.responses_deadline ?? null,
    documents:           resolveDocuments(item.documents),
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
    executorProposedStartDate: item.executor_proposed_start_date ?? "",
    executorProposedDeadline: item.executor_proposed_deadline ?? "",
    executorComment:     item.executor_comment ?? "",
    executorFiles:       resolveFileUrls(item.executor_files ?? []),
    acceptedResponseId:  item.accepted_response_id ?? null,
    customerHasReview:   item.customer_has_review ?? false,
    previousTitle:       item.previous_title ?? null,
    previousComment:     item.previous_comment ?? null,
    previousSum:         item.previous_sum ? normalizeCurrency(item.previous_sum) : null,
    previousDeadline:    item.previous_date ?? null,
    previousDocuments:   item.previous_documents ? resolveDocuments(item.previous_documents) : null,
    previousBadges: item.previous_badges
      ? item.previous_badges.map((b) => ({
          text: b.text,
          variant: VARIANT_MAP[b.variant] ?? "blue",
        }))
      : null,
  };
}
