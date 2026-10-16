import { uploadForm } from "@/shared/api/upload-form";
import { getNewOrderFiles } from "../model/new-files";
import type { OrderDocumentsRequest, OrderRequest } from "../model/order-request";
import { createOrderFormData } from "./order-form-data";

/** Создаёт заказ от имени текущей сессии вместе с новыми или скопированными файлами. */
export async function createOrder(
  payload: OrderRequest,
  documents: OrderDocumentsRequest,
): Promise<void> {
  /** Пересобирает форму с перечитанными файлами при повторной отправке. */
  function createBody(files: File[]): FormData {
    return createOrderFormData(payload, documents, files);
  }

  await uploadForm("/orders/create-with-files", {
    method: "POST",
    files: getNewOrderFiles(documents.files),
    createBody,
    errorMessage: "Не удалось создать заказ",
  });
}
