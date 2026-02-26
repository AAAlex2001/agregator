import type { ResponseBadge } from "../components/types";
import type {
  ResponseApiItem,
  ResponseCardViewModel,
} from "./types";

function mapBadgeVariant(variant: string): ResponseBadge["variant"] {
  switch (variant.toLowerCase()) {
    case "green":
      return "green";
    case "gray":
      return "gray";
    case "orange":
      return "orange";
    case "brown":
      return "brown";
    case "blue":
    default:
      return "blue";
  }
}

function mapStatus(status: ResponseApiItem["status"]): {
  label: string;
  color: string;
  bg: string;
} {
  switch (status) {
    case "REVIEW":
      return { label: "На рассмотрении", color: "#CC6E00", bg: "#FFF5E6" };
    case "REJECTED":
      return { label: "Отклонен", color: "#C62828", bg: "#FFEBEE" };
    case "ACCEPTED":
      return { label: "В переговорах", color: "#FFFFFF", bg: "#FF8A00" };
    case "IN_PROGRESS":
      return { label: "Принято", color: "#137333", bg: "#E6F4EA" };
    case "COMPLETED":
      return { label: "Завершен", color: "#555555", bg: "#F5F5F5" };
    default:
      return { label: "На рассмотрении", color: "#CC6E00", bg: "#FFF5E6" };
  }
}

export function mapResponseItemToCard(item: ResponseApiItem): ResponseCardViewModel {
  const mappedStatus = mapStatus(item.status);
  const isInvitation = item.status === "ACCEPTED";
  const isNegotiation = item.status === "IN_PROGRESS";
  const expertConfirmed = item.expert_confirmed ?? false;

  let statusLabel = mappedStatus.label;
  let statusColor = mappedStatus.color;
  let statusBg = mappedStatus.bg;
  let statusMessage: string | undefined;

  if (isInvitation) {
    statusLabel = `Приглашение на собеседование от ${item.date}`;
  } else if (isNegotiation && !expertConfirmed) {
    statusMessage = "Заказчик выбрал вас!";
  } else if (isNegotiation && expertConfirmed) {
    statusLabel = `Принято ${item.date}`;
  }

  return {
    id: item.id,
    orderId: item.order_id,
    rawStatus: item.status,
    dateLabel: "Отклик от",
    date: item.date,
    status: statusLabel,
    statusColor: statusColor,
    statusBg: statusBg,
    statusMessage: statusMessage,
    orderTitle: item.order_title,
    orderCustomerSum: item.order_sum,
    customer: item.customer_name,
    customerCompany: item.customer_company,
    orderDate: item.order_date,
    badges: item.badges.map((badge) => ({
      text: badge.text,
      variant: mapBadgeVariant(badge.variant),
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
    orderComment: item.order_comment || "",
    techSpecTitle: item.response_files.length > 0 ? "Файлы отклика:" : undefined,
    techSpecFiles: item.response_files,
    orderTechSpecFiles: item.technical_files,
    rawSumAmount: item.proposed_sum_amount_raw ?? 0,
    rawDeadline: item.proposed_deadline_raw ?? "",
    expertName: item.expert_name || "",
    expertRating: item.expert_rating ?? null,
    expertReviewCount: item.expert_review_count ?? 0,
    expertConfirmed: expertConfirmed,
    reminderText: (isNegotiation && !expertConfirmed) && item.confirm_deadline ? `Подтвердите согласие до ${item.confirm_deadline}` : undefined,
    hasReview: item.has_review ?? false,
  };
}
