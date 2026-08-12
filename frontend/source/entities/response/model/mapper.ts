import type { ResponseApiItem, ResponseCardData, ResponseBadge, BadgeVariant, UserRole, VatKind } from "./types";
import { VAT_LABEL } from "./types";
import { resolveFileUrls } from "@/source/shared/lib/fileUrl";
import { emptyDocuments, type OrderDocuments } from "@/source/entities/order";

function resolveDocuments(documents: OrderDocuments | undefined | null): OrderDocuments {
  if (!documents) return emptyDocuments();
  return {
    technical: resolveFileUrls(documents.technical),
    contract: resolveFileUrls(documents.contract),
    company: resolveFileUrls(documents.company),
    other: resolveFileUrls(documents.other),
  };
}

const BADGE_MAP: Record<string, BadgeVariant> = {
  green: "green", gray: "gray", orange: "orange", brown: "brown", purple: "purple",
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  REVIEW:      { label: "На рассмотрении", color: "#8a4500", bg: "#ffe0b2" },
  REJECTED:    { label: "Отклонен",        color: "#8b0000", bg: "#ffcdd2" },
  ACCEPTED:    { label: "В переговорах",   color: "#ffffff", bg: "#ff8a00" },
  IN_PROGRESS: { label: "Принято",         color: "#0b5723", bg: "#b2dfb6" },
  COMPLETED:   { label: "Завершен",        color: "#2e2e2e", bg: "#dcdcdc" },
  WITHDRAWN_BY_EXPERT: { label: "Отозван исполнителем", color: "#4d4d4d", bg: "#e6e6e6" },
};

function resolveStatus(
  item: ResponseApiItem,
  role: UserRole,
  confirmed: boolean,
): { status: string; statusMessage?: string } {
  const base = (STATUS_MAP[item.status] ?? STATUS_MAP.REVIEW).label;
  if (role === "expert") {
    if (item.status === "ACCEPTED") return { status: `Приглашение на собеседование от ${item.date}` };
    if (item.status === "IN_PROGRESS" && !confirmed) return { status: base, statusMessage: "Заказчик выбрал вас!" };
    if (item.status === "IN_PROGRESS" && confirmed) return { status: `Принято ${item.date}` };
    return { status: base };
  }
  if (item.status === "ACCEPTED") return { status: "В переговорах" };
  if (item.status === "IN_PROGRESS") return { status: "Исполнитель выбран" };
  return { status: base };
}

export function mapApiToCard(item: ResponseApiItem, role: UserRole): ResponseCardData {
  const s = STATUS_MAP[item.status] ?? STATUS_MAP.REVIEW;
  const confirmed = item.expert_confirmed ?? false;
  const { status, statusMessage } = resolveStatus(item, role, confirmed);

  const vatKind = (item.vat_kind ?? "NONE") as VatKind;
  const vatLabel = VAT_LABEL[vatKind];
  const costEstimateWithVat = item.proposed_sum && item.proposed_sum.trim()
    ? `${item.proposed_sum} · ${vatLabel}`
    : item.proposed_sum;

  const previousVatKind = (item.previous_vat_kind ?? null) as VatKind | null;
  const previousSumStr = item.previous_proposed_sum ?? null;
  const previousVatLabel = previousVatKind ? VAT_LABEL[previousVatKind] : vatLabel;

  let previousCostEstimate: string | null = null;
  if (previousSumStr) {
    previousCostEstimate = `${previousSumStr} · ${previousVatLabel}`;
  } else if (previousVatKind && previousVatKind !== vatKind) {
    previousCostEstimate = `${item.proposed_sum} · ${previousVatLabel}`;
  }

  return {
    id: item.id,
    orderId: item.order_id,
    expertId: item.expert_id ?? 0,
    orderPublicId: item.order_public_id || "",
    orderCustomerId: item.order_customer_id ?? 0,
    rawStatus: item.status,
    dateLabel: "Отклик от",
    date: item.date,
    status,
    statusColor: s.color,
    statusBg: s.bg,
    statusMessage,
    orderTitle: item.order_title,
    orderSum: item.order_sum,
    customer: item.customer_company || item.customer_name,
    customerInn: item.customer_inn ?? "",
    orderStartDate: item.order_start_date ?? "",
    orderDate: item.order_date,
    badges: item.badges.map((b): ResponseBadge => ({
      text: b.text,
      variant: BADGE_MAP[b.variant.toLowerCase()] ?? "blue",
    })),
    sum: item.proposed_sum,
    startDate: item.proposed_start_date ?? "",
    deadline: item.proposed_deadline,
    previousSum: item.previous_proposed_sum ?? null,
    previousStartDate: item.previous_proposed_start_date ?? null,
    previousDeadline: item.previous_proposed_deadline ?? null,
    previousCostEstimate,
    previousComment: item.previous_comment ?? null,
    previousTechSpecFiles: item.previous_response_files
      ? resolveFileUrls(item.previous_response_files)
      : null,
    previousOrderTitle: item.order_previous_title ?? null,
    previousOrderComment: item.order_previous_comment ?? null,
    previousOrderSum: item.order_previous_sum ?? null,
    previousOrderDate: item.order_previous_date ?? null,
    previousOrderDocuments: item.order_previous_documents
      ? resolveDocuments(item.order_previous_documents)
      : null,
    previousOrderBadges: item.order_previous_badges
      ? item.order_previous_badges.map((b): ResponseBadge => ({
          text: b.text,
          variant: BADGE_MAP[b.variant.toLowerCase()] ?? "blue",
        }))
      : null,
    costEstimate: costEstimateWithVat,
    commentTitle: "Комментарий:",
    commentText: item.comment || "",
    orderComment: item.order_comment,
    rawTechSpecFiles: item.response_files ?? [],
    techSpecFiles: resolveFileUrls(item.response_files),
    orderDocuments: resolveDocuments(item.order_documents),
    rawSumAmount: item.proposed_sum_amount_raw ?? 0,
    rawStartDate: item.proposed_start_date_raw ?? "",
    rawDeadline: item.proposed_deadline_raw ?? "",
    expertConfirmed: confirmed,
    reminderText:
      item.status === "IN_PROGRESS" && !confirmed && item.confirm_deadline
        ? `Подтвердите согласие до ${item.confirm_deadline}`
        : undefined,
    expertName: item.expert_name || "",
    expertAvatarUrl: item.expert_avatar_url ?? null,
    expertRating: item.expert_rating,
    expertReviewCount: item.expert_review_count ?? 0,
    expertPublicId: item.expert_public_id || "",
    hasReview: item.has_review ?? false,
    rejectionReason: item.rejection_reason ?? null,
    expertCompanyName: item.expert_company_name ?? "",
    expertInn: item.expert_inn ?? null,
    vatKind,
    vatLabel,
    orderLocked: Boolean(item.order_locked),
  };
}
