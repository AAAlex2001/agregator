import type { ResponseBadge } from "@/app/components/ResponseCards";
import type {
  ResponseApiItem,
  ResponseCardViewModel,
} from "./types";

function mapBadgeVariant(variant: string): ResponseBadge["variant"] {
  return variant.toLowerCase() === "green" ? "green" : "blue";
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
      return { label: "Принято", color: "#137333", bg: "#E6F4EA" };
    case "IN_PROGRESS":
      return { label: "В работе", color: "#1565C0", bg: "#E3F2FD" };
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

  return {
    id: item.id,
    rawStatus: item.status,
    dateLabel: "Отклик от",
    date: item.date,
    status: mappedStatus.label,
    statusColor: mappedStatus.color,
    statusBg: mappedStatus.bg,
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
    commissionAmount: "0 ₽",
    commentTitle: "Комментарий:",
    commentText: item.comment || "",
    techSpecTitle: item.technical_files.length > 0 ? "Техническое задание:" : undefined,
    techSpecFiles: item.technical_files,
  };
}
