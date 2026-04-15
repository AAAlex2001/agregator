import type { ResponseApiItem, ResponseCardData, ResponseBadge, BadgeVariant } from "./types";

const BADGE_MAP: Record<string, BadgeVariant> = {
  green: "green", gray: "gray", orange: "orange", brown: "brown", purple: "purple",
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  REVIEW:      { label: "На рассмотрении", color: "#CC6E00", bg: "#FFF5E6" },
  REJECTED:    { label: "Отклонен",        color: "#C62828", bg: "#FFEBEE" },
  ACCEPTED:    { label: "В переговорах",   color: "#FFFFFF", bg: "#FF8A00" },
  IN_PROGRESS: { label: "Принято",         color: "#137333", bg: "#E6F4EA" },
  COMPLETED:   { label: "Завершен",        color: "#555555", bg: "#F5F5F5" },
};

export function mapApiToCard(item: ResponseApiItem): ResponseCardData {
  const s = STATUS_MAP[item.status] ?? STATUS_MAP.REVIEW;
  const confirmed = item.expert_confirmed ?? false;

  let status = s.label;
  let statusMessage: string | undefined;

  if (item.status === "ACCEPTED") status = `Приглашение на собеседование от ${item.date}`;
  else if (item.status === "IN_PROGRESS" && !confirmed) statusMessage = "Заказчик выбрал вас!";
  else if (item.status === "IN_PROGRESS" && confirmed) status = `Принято ${item.date}`;

  return {
    id: item.id,
    orderId: item.order_id,
    orderPublicId: item.order_public_id || "",
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
    costEstimate: item.proposed_sum,
    commissionText: "Взнос в размере",
    commissionAmount: item.commission_paid || item.order_commission_amount || "0 ₽",
    orderCommissionAmount: item.order_commission_amount,
    commissionStatus: item.commission_paid ? "получен" : undefined,
    balanceReturnText: item.balance_return ? "При отзыве вернется" : undefined,
    balanceReturnAmount: item.balance_return ?? undefined,
    commentTitle: "Комментарий:",
    commentText: item.comment || "",
    orderComment: item.order_comment,
    techSpecFiles: item.response_files,
    orderTechSpecFiles: item.technical_files,
    rawSumAmount: item.proposed_sum_amount_raw ?? 0,
    rawDeadline: item.proposed_deadline_raw ?? "",
    expertConfirmed: confirmed,
    reminderText:
      item.status === "IN_PROGRESS" && !confirmed && item.confirm_deadline
        ? `Подтвердите согласие до ${item.confirm_deadline}`
        : undefined,
  };
}
