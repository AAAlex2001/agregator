import { fetchOrders } from "./api";
import { mapOrderToCardViewModel } from "./mappers";
import { createResponseForOrder } from "@/features/response/list-expert/model/api";
import { createPayment } from "@/features/balance/topup/model/api";
import type { Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";

export async function loadOrders(
  skip = 0,
  limit = 50,
  onSuccess?: (payload: { itemsCount: number; total: number; items: ReturnType<typeof mapOrderToCardViewModel>[] }) => void,
  onError?: (message: string) => void
): Promise<void> {
  try {
    const response = await fetchOrders(skip, limit);
    const mappedItems = response.items.map(mapOrderToCardViewModel);

    onSuccess?.({
      itemsCount: mappedItems.length,
      total: response.total,
      items: mappedItems,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Произошла ошибка при загрузке заказов";
    onError?.(message);
    throw error;
  }
}

export async function handleRespondToOrder(
  orderId: number,
  formData: Step2FormData,
  onSuccess: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await createResponseForOrder(orderId, {
      comment: formData.comment,
      proposed_sum_amount: formData.costEstimate,
      proposed_deadline: formData.deadline,
      files: formData.files,
    });
    onSuccess();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось отправить отклик");
  }
}

export async function handleTopUp(
  orderId: number,
  amountKopecks: number,
  onError: (message: string) => void,
): Promise<void> {
  const returnUrl = `${window.location.origin}/expert/orders?orderId=${orderId}`;
  try {
    const { confirmation_url } = await createPayment(amountKopecks, returnUrl);
    window.location.href = confirmation_url;
  } catch {
    window.location.href = `/settings?section=finance&returnOrderId=${orderId}`;
  }
}
