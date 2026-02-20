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
    case "NEW":
      return { label: "Новый отклик", color: "#CC6E00", bg: "#FFF5E6" };
    case "REVIEW":
      return { label: "На рассмотрении", color: "#CC6E00", bg: "#FFF5E6" };
    case "REJECTED":
      return { label: "Отклонен", color: "#C62828", bg: "#FFEBEE" };
    case "ACCEPTED":
      return { label: "Исполнитель выбран", color: "#137333", bg: "#E6F4EA" };
    case "IN_PROGRESS":
      return { label: "В переговорах", color: "#FFFFFF", bg: "#FF8A00" };
    case "COMPLETED":
      return { label: "Завершен", color: "#555555", bg: "#F5F5F5" };
    case "ARCHIVED":
      return { label: "Архив", color: "#555555", bg: "#F5F5F5" };
    default:
      return { label: "На рассмотрении", color: "#CC6E00", bg: "#FFF5E6" };
  }
}

export function mapResponseItemToCard(item: ResponseApiItem): ResponseCardViewModel {
  const mappedStatus = mapStatus(item.status);
  const isAccepted = item.status === "ACCEPTED";

  return {
    id: item.id,
    orderId: item.order_id,
    rawStatus: item.status,
    dateLabel: "Отклик от",
    date: item.date,
    status: mappedStatus.label,
    statusColor: mappedStatus.color,
    statusBg: mappedStatus.bg,
    statusMessage: isAccepted ? "Заказчик выбрал вас!" : undefined,
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
    commissionAmount: item.commission_paid ?? "0 ₽",
    orderCommissionAmount: item.order_commission_amount,
    commissionStatus: item.commission_paid ? "получен" : undefined,
    balanceReturnText: isAccepted && item.balance_return ? "На ваш баланс вернется" : undefined,
    balanceReturnAmount: isAccepted && item.balance_return ? item.balance_return : undefined,
    commentTitle: "Комментарий:",
    commentText: item.comment || "",
    techSpecTitle: item.response_files.length > 0 ? "Файлы отклика:" : undefined,
    techSpecFiles: item.response_files,
    rawSumAmount: item.proposed_sum_amount_raw ?? 0,
    rawDeadline: item.proposed_deadline_raw ?? "",
    expertName: item.expert_name || "",
    expertRating: item.expert_rating ?? null,
    expertReviewCount: item.expert_review_count ?? 0,
    reminderText: isAccepted ? `Подтвердите согласие до ${item.proposed_deadline}` : undefined,
  };
}
