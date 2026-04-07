import { openChatByOrder } from "@/shared/lib/chatApi";
import { loadResponses } from "@/features/response/shared/model/actions";
import { updateResponseStatus } from "@/features/response/shared/model/api";
import { createReview } from "./api";
import type { ResponseCardViewModel, ResponseTabKey, ResponseCounters } from "@/features/response/shared/model/types";

export async function fetchCustomerResponses(
  tab: ResponseTabKey,
  onSuccess: (data: { items: ResponseCardViewModel[]; counters: ResponseCounters }) => void,
  onError: (message: string) => void,
): Promise<void> {
  await loadResponses(tab, onSuccess, onError);
}

export async function handleStatusUpdate(
  responseId: number,
  newStatus: "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED",
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await updateResponseStatus(responseId, newStatus);
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось обновить статус отклика");
  }
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

export async function handleSubmitReview(
  responseId: number,
  payload: { rating: number; comment: string },
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await createReview({
      response_id: responseId,
      rating: payload.rating,
      comment: payload.comment,
    });
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось оставить отзыв");
  }
}
