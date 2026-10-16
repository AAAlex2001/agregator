import { SINGLE_ORDER_DOCUMENT_CATEGORIES } from "../config/files";
import type { OrderDocumentsRequest, OrderRequest } from "../model/order-request";

/** Собирает условия заказа и документы, используя файлы текущей попытки отправки. */
export function createOrderFormData(
  payload: OrderRequest,
  documents: OrderDocumentsRequest,
  files: File[],
): FormData {
  const form = new FormData();

  form.append("title", payload.title);
  form.append("company", payload.company);
  form.append("comment", payload.comment);
  form.append("sum_amount", String(payload.sum_amount));
  form.append("deadline", payload.deadline);
  form.append("requires_expert", String(payload.requires_expert));
  form.append("requires_license", String(payload.requires_license));
  form.append("work_type", payload.work_type);
  form.append("badge_codes_json", JSON.stringify(payload.badge_codes));

  if (payload.start_date) {
    form.append("start_date", payload.start_date);
  }

  if (payload.responses_deadline) {
    form.append("responses_deadline", payload.responses_deadline);
  }

  if (payload.details) {
    form.append("details_json", JSON.stringify(payload.details));
  }

  if (documents.copySourceOrderId !== null) {
    form.append("copy_source_order_id", String(documents.copySourceOrderId));
    form.append("copy_documents_json", JSON.stringify(documents.existing));
    form.append("keep_documents_json", "{}");
  } else {
    form.append("copy_documents_json", "{}");
    form.append("keep_documents_json", JSON.stringify(documents.existing));
  }

  let fileIndex = 0;

  for (const category of SINGLE_ORDER_DOCUMENT_CATEGORIES) {
    if (documents.files[category]) {
      form.append(`${category}_files`, files[fileIndex]);
      fileIndex += 1;
    }
  }

  for (const file of files.slice(fileIndex)) {
    form.append("other_files", file);
  }

  return form;
}
