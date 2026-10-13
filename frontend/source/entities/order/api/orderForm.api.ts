import { sendForm } from "@/source/shared/api/request";
import type { OrderDocuments } from "../model/types";
import type { OrderWorkType } from "../model/workTypes";

export interface OrderPayload {
  title: string;
  company: string;
  comment: string;
  sum_amount: number;
  start_date: string;
  deadline: string;
  responses_deadline: string;
  requires_expert: boolean;
  requires_license: boolean;
  work_type: OrderWorkType;
  badge_codes: string[];
  details: object | null;
}

export interface OrderFilesPayload {
  technical: File | null;
  contract: File | null;
  company: File | null;
  other: File[];
}

export interface OrderDocumentsPayload {
  existing: OrderDocuments;
  copySourceOrderId: number | null;
  files: OrderFilesPayload;
}

function orderFormData(payload: OrderPayload, documents: OrderDocumentsPayload): FormData {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("company", payload.company);
  form.append("comment", payload.comment);
  form.append("sum_amount", String(payload.sum_amount));
  if (payload.start_date) form.append("start_date", payload.start_date);
  form.append("deadline", payload.deadline);
  if (payload.responses_deadline) form.append("responses_deadline", payload.responses_deadline);
  form.append("requires_expert", String(payload.requires_expert));
  form.append("requires_license", String(payload.requires_license));
  form.append("work_type", payload.work_type);
  form.append("badge_codes_json", JSON.stringify(payload.badge_codes));
  if (payload.details) form.append("details_json", JSON.stringify(payload.details));
  if (documents.copySourceOrderId !== null) {
    form.append("copy_source_order_id", String(documents.copySourceOrderId));
    form.append("copy_documents_json", JSON.stringify(documents.existing));
    form.append("keep_documents_json", "{}");
  } else {
    form.append("copy_documents_json", "{}");
    form.append("keep_documents_json", JSON.stringify(documents.existing));
  }
  const { technical, contract, company, other } = documents.files;
  if (technical) form.append("technical_files", technical);
  if (contract) form.append("contract_files", contract);
  if (company) form.append("company_files", company);
  other.forEach((file) => form.append("other_files", file));
  return form;
}

export function orderNewFiles(files: OrderFilesPayload): File[] {
  return [files.technical, files.contract, files.company, ...files.other].filter((file) => file !== null);
}

export async function createOrder(customerId: number, payload: OrderPayload, documents: OrderDocumentsPayload): Promise<void> {
  await sendForm(
    "/orders/create-with-files",
    "POST",
    orderNewFiles(documents.files),
    () => {
      const form = orderFormData(payload, documents);
      form.append("customer_id", String(customerId));
      return form;
    },
    "Не удалось создать заказ",
  );
}

export async function updateOrder(
  id: number,
  payload: OrderPayload,
  documents: OrderDocumentsPayload,
  notifyResponders: boolean,
): Promise<void> {
  await sendForm(
    `/orders/${id}/update-with-files`,
    "PATCH",
    orderNewFiles(documents.files),
    () => {
      const form = orderFormData(payload, documents);
      form.append("notify_responders", String(notifyResponders));
      return form;
    },
    "Не удалось обновить заказ",
  );
}
