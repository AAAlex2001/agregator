import { resolveFileUrls } from "@/source/shared/lib/fileUrl";
import { emptyDocuments, type Badge, type BadgeVariant, type OrderApiBadge, type OrderApiItem, type OrderCardData, type OrderDocuments } from "./types";

const VARIANTS: Record<string, BadgeVariant> = {
  BLUE: "blue",
  GREEN: "green",
  GRAY: "gray",
  ORANGE: "orange",
  BROWN: "brown",
  PURPLE: "purple",
};

export function toBadges(badges: OrderApiBadge[]): Badge[] {
  return badges.map((badge) => ({ text: badge.text, variant: VARIANTS[badge.variant.toUpperCase()] ?? "blue" }));
}

function toIsoDate(displayDate: string): string {
  const [day, month, year] = displayDate.split(".");
  return year ? `${year}-${month}-${day}` : displayDate;
}

function resolveDocuments(documents: OrderDocuments | null | undefined): OrderDocuments {
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
    id: item.id,
    publicId: item.public_id,
    customerId: item.customer_id,
    title: item.title,
    customer: item.company || item.customer_name,
    customerInn: item.customer_inn ?? "",
    company: item.company,
    comment: item.comment,
    startDate: item.start_date ?? "",
    date: item.date,
    createdAtDisplay: item.created_at_display ?? "",
    startDateRaw: item.start_date ? toIsoDate(item.start_date) : "",
    deadlineRaw: toIsoDate(item.date),
    sum: item.sum,
    sumAmountRaw: item.sum_amount_raw,
    responsesDeadline: item.responses_deadline,
    requiresExpert: item.requires_expert ?? true,
    requiresLicense: item.requires_license ?? true,
    workType: item.work_type ?? "EXPERTISE",
    details: item.details ?? null,
    documents: resolveDocuments(item.documents),
    badges: toBadges(item.badges),
    badgesRaw: item.badges,
    status: item.status,
    assignedExpertName: item.assigned_expert_name ?? "",
    executorName: item.executor_name ?? "",
    executorAvatarUrl: item.executor_avatar_url ?? null,
    executorRating: item.executor_rating ?? null,
    executorReviewCount: item.executor_review_count ?? 0,
    executorPublicId: item.executor_public_id ?? "",
    executorProposedSum: item.executor_proposed_sum ?? "",
    executorProposedStartDate: item.executor_proposed_start_date ?? "",
    executorProposedDeadline: item.executor_proposed_deadline ?? "",
    executorComment: item.executor_comment ?? "",
    executorFiles: resolveFileUrls(item.executor_files ?? []),
    acceptedResponseId: item.accepted_response_id ?? null,
    customerHasReview: item.customer_has_review ?? false,
    previousTitle: item.previous_title ?? null,
    previousComment: item.previous_comment ?? null,
    previousSum: item.previous_sum ?? null,
    previousDeadline: item.previous_date ?? null,
    previousDocuments: item.previous_documents ? resolveDocuments(item.previous_documents) : null,
    previousBadges: item.previous_badges ? toBadges(item.previous_badges) : null,
  };
}
