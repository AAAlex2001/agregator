import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { openChatByOrder } from "@/shared/lib/chatApi";
import { parseDisplayAmountToKopecks } from "@/shared/lib/formatMoney";
import { loadResponses } from "@/features/response/shared/model/actions";
import { updateResponseStatus } from "@/features/response/shared/model/api";
import { updateExistingResponse, withdrawResponse } from "./api";
import type { ResponseCardViewModel, ResponseTabKey, ResponseCounters } from "@/features/response/shared/model/types";
import type { OrderDetails, Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";

export { loadResponses } from "@/features/response/shared/model/actions";

export function buildEditOrderDetails(r: ResponseCardViewModel): OrderDetails {
  return {
    id: r.orderId,
    badges: r.badges,
    title: r.orderTitle,
    customer: r.customerCompany || r.customer,
    date: r.orderDate,
    deadlineRaw: r.orderDate,
    sum: r.orderCustomerSum || r.sum,
    sumAmountRaw: parseDisplayAmountToKopecks(r.orderCustomerSum || r.sum),
    commissionAmount: r.orderCommissionAmount,
    commissionAmountRaw: parseDisplayAmountToKopecks(r.orderCommissionAmount),
    comment: "",
    technicalFiles: r.techSpecFiles || [],
  };
}

export async function handleShareResponse(
  publicId: string,
  onSuccess: () => void,
): Promise<void> {
  copyOrderLink(publicId, onSuccess);
}

export async function handleOpenChat(
  orderId: number,
  onSuccess: (uuid: string) => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    const detail = await openChatByOrder(orderId);
    onSuccess(detail.uuid);
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось открыть чат");
  }
}

export async function handleWithdrawReview(
  responseId: number,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await withdrawResponse(responseId);
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось отозвать отклик");
  }
}

export async function handleStartOrComplete(
  responseId: number,
  isInProgress: boolean,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await updateResponseStatus(responseId, isInProgress ? "COMPLETED" : "IN_PROGRESS");
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : isInProgress ? "Не удалось завершить проект" : "Не удалось перевести проект в работу");
  }
}

export async function handleEditResponse(
  responseId: number,
  formData: Step2FormData,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await updateExistingResponse(responseId, {
      comment: formData.comment,
      proposed_sum_amount: formData.costEstimate,
      proposed_deadline: formData.deadline,
      files: formData.files,
      keepFiles: formData.keepFiles,
    });
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось обновить отклик");
  }
}

export function buildEditInitialData(r: ResponseCardViewModel) {
  return {
    deadline: r.rawDeadline || "",
    costEstimate: r.rawSumAmount > 0 ? String(r.rawSumAmount / 100) : "",
    comment: r.commentText,
    existingFiles: r.techSpecFiles ?? [],
    dateLabel: r.dateLabel,
    date: r.date,
    status: r.status,
    statusColor: r.statusColor,
    statusBg: r.statusBg,
  };
}

export function buildWithdrawProps(t: ResponseCardViewModel | null) {
  return {
    dateLabel: t?.dateLabel ?? "",
    date: t?.date ?? "",
    status: t?.status ?? "",
    statusColor: t?.statusColor ?? "",
    statusBg: t?.statusBg ?? "",
    orderTitle: t?.orderTitle ?? "",
    customer: t?.customerCompany || (t?.customer ?? ""),
    orderDate: t?.orderDate ?? "",
    badges: t?.badges ?? [],
    sum: t?.orderCustomerSum || (t?.sum ?? ""),
    balanceReturnAmount: t?.balanceReturnAmount,
  };
}

export async function fetchExpertResponses(
  tab: ResponseTabKey,
  onSuccess: (data: { items: ResponseCardViewModel[]; counters: ResponseCounters }) => void,
  onError: (message: string) => void,
): Promise<void> {
  await loadResponses(tab, onSuccess, onError);
}
