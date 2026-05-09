import type { ResponseApiItem, ResponseCardData, ResponseBadge, BadgeVariant, UserRole, VatKind } from "./types";
import { VAT_LABEL } from "./types";
import { resolveFileUrls } from "@/source/shared/lib/fileUrl";

const BADGE_MAP: Record<string, BadgeVariant> = {
  green: "green", gray: "gray", orange: "orange", brown: "brown", purple: "purple",
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  REVIEW:      { label: "На рассмотрении", color: "#8a4500", bg: "#ffe0b2" },
  REJECTED:    { label: "Отклонен",        color: "#8b0000", bg: "#ffcdd2" },
  ACCEPTED:    { label: "В переговорах",   color: "#ffffff", bg: "#ff8a00" },
  IN_PROGRESS: { label: "Принято",         color: "#0b5723", bg: "#b2dfb6" },
  COMPLETED:   { label: "Завершен",        color: "#2e2e2e", bg: "#dcdcdc" },
};

export function mapApiToCard(item: ResponseApiItem, role: UserRole): ResponseCardData {
  const s = STATUS_MAP[item.status] ?? STATUS_MAP.REVIEW;
  const confirmed = item.expert_confirmed ?? false;

  let status = s.label;
  let statusMessage: string | undefined;

  if (role === "expert") {
    if (item.status === "ACCEPTED") {
      status = `Приглашение на собеседование от ${item.date}`;
    } else if (item.status === "IN_PROGRESS" && !confirmed) {
      statusMessage = "Заказчик выбрал вас!";
    } else if (item.status === "IN_PROGRESS" && confirmed) {
      status = `Принято ${item.date}`;
    }
  } else {
    if (item.status === "ACCEPTED") {
      status = "В переговорах";
    } else if (item.status === "IN_PROGRESS") {
      status = "Исполнитель выбран";
    }
  }

  const vatKind = (item.vat_kind ?? "NONE") as VatKind;
  const vatLabel = VAT_LABEL[vatKind];
  const costEstimateWithVat = item.proposed_sum && item.proposed_sum.trim()
    ? `${item.proposed_sum} · ${vatLabel}`
    : item.proposed_sum;

  return {
    id: item.id,
    orderId: item.order_id,
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
    orderDate: item.order_date,
    badges: item.badges.map((b): ResponseBadge => ({
      text: b.text,
      variant: BADGE_MAP[b.variant.toLowerCase()] ?? "blue",
    })),
    sum: item.proposed_sum,
    deadline: item.proposed_deadline,
    previousSum: item.previous_proposed_sum ?? null,
    previousDeadline: item.previous_proposed_deadline ?? null,
    costEstimate: costEstimateWithVat,
    commentTitle: "Комментарий:",
    commentText: item.comment || "",
    orderComment: item.order_comment,
    rawTechSpecFiles: item.response_files ?? [],
    techSpecFiles: resolveFileUrls(item.response_files),
    orderTechSpecFiles: resolveFileUrls(item.technical_files),
    rawSumAmount: item.proposed_sum_amount_raw ?? 0,
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
