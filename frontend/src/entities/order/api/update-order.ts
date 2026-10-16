import { uploadForm } from "@/shared/api/upload-form";
import { getNewOrderFiles } from "../model/new-files";
import type { OrderDocumentsRequest, OrderRequest } from "../model/order-request";
import { createOrderFormData } from "./order-form-data";

/** Обновляет свой заказ и передаёт выбор уведомления уже откликнувшихся участников. */
export async function updateOrder(
  orderId: number,
  payload: OrderRequest,
  documents: OrderDocumentsRequest,
  notifyResponders: boolean,
): Promise<void> {
  /** Добавляет настройку уведомлений к каждой попытке отправки формы. */
  function createBody(files: File[]): FormData {
    const form = createOrderFormData(payload, documents, files);

    form.append("notify_responders", String(notifyResponders));
    return form;
  }

  await uploadForm(`/orders/${orderId}/update-with-files`, {
    method: "PATCH",
    files: getNewOrderFiles(documents.files),
    createBody,
    errorMessage: "Не удалось обновить заказ",
  });
}
