import type { ResponseStatus } from "./types";

interface StatusMeta {
  label: string;
  color: string;
  bg: string;
}

const STATUS_META: Record<ResponseStatus, StatusMeta> = {
  REVIEW: { label: "На рассмотрении", color: "#8a4500", bg: "#ffe0b2" },
  REJECTED: { label: "Отклонён", color: "#8b0000", bg: "#ffcdd2" },
  ACCEPTED: { label: "В переговорах", color: "#ffffff", bg: "#ff8a00" },
  IN_PROGRESS: { label: "Принято", color: "#0b5723", bg: "#b2dfb6" },
  COMPLETED: { label: "Завершён", color: "#2e2e2e", bg: "#dcdcdc" },
  WITHDRAWN_BY_EXPERT: { label: "Отозван", color: "#4d4d4d", bg: "#e6e6e6" },
};

export function statusMeta(status: ResponseStatus): StatusMeta {
  return STATUS_META[status] ?? STATUS_META.REVIEW;
}

export function canWithdraw(status: ResponseStatus): boolean {
  return status === "REVIEW" || status === "ACCEPTED" || status === "IN_PROGRESS";
}

export function canRestore(status: ResponseStatus): boolean {
  return status === "WITHDRAWN_BY_EXPERT";
}
