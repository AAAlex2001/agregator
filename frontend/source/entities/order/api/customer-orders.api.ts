import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type { OrderWorkType, OrdersApiList } from "@/source/entities/order";
import type { DocumentsFormState } from "@/source/features/customer-orders/model/formFiles";

export async function fetchCustomerOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить заказы");
  return res.json();
}

interface CreatePayload {
  title: string; company: string; comment: string;
  customer_id: number; sum_amount: number;
  start_date?: string; deadline: string;
  responses_deadline?: string; badge_codes: string[];
  requires_expert: boolean; requires_license: boolean;
  work_type: OrderWorkType;
  details?: Record<string, unknown>;
  documents: DocumentsFormState;
}

interface UpdatePayload {
  title: string; company: string; comment: string;
  sum_amount: number; start_date?: string; deadline: string;
  responses_deadline?: string;
  badge_codes: string[]; documents: DocumentsFormState;
  requires_expert: boolean; requires_license: boolean;
  work_type: OrderWorkType;
  details?: Record<string, unknown>;
  notify_responders: boolean;
}

function appendFiles(fd: FormData, documents: DocumentsFormState, files: File[]): void {
  const order: Array<{ field: string; count: number }> = [
    { field: "technical_files", count: documents.technical.newFile ? 1 : 0 },
    { field: "contract_files", count: documents.contract.newFile ? 1 : 0 },
    { field: "company_files", count: documents.company.newFile ? 1 : 0 },
    { field: "other_files", count: documents.other.newFiles.length },
  ];
  let offset = 0;
  for (const { field, count } of order) {
    for (let i = 0; i < count; i += 1) {
      const file = files[offset + i];
      if (file) fd.append(field, file);
    }
    offset += count;
  }
}

function collectNewFiles(documents: DocumentsFormState): File[] {
  const result: File[] = [];
  if (documents.technical.newFile) result.push(documents.technical.newFile);
  if (documents.contract.newFile) result.push(documents.contract.newFile);
  if (documents.company.newFile) result.push(documents.company.newFile);
  result.push(...documents.other.newFiles);
  return result;
}

function buildKeepDocuments(documents: DocumentsFormState): string {
  if (documents.copySourceOrderId !== null) return "{}";
  return JSON.stringify({
    technical: documents.technical.existing ? [documents.technical.existing] : [],
    contract: documents.contract.existing ? [documents.contract.existing] : [],
    company: documents.company.existing ? [documents.company.existing] : [],
    other: documents.other.existing,
  });
}

function buildCopyDocuments(documents: DocumentsFormState): string {
  if (documents.copySourceOrderId === null) return "{}";
  return JSON.stringify({
    technical: documents.technical.existing ? [documents.technical.existing] : [],
    contract: documents.contract.existing ? [documents.contract.existing] : [],
    company: documents.company.existing ? [documents.company.existing] : [],
    other: documents.other.existing,
  });
}

function appendCopySource(fd: FormData, documents: DocumentsFormState): void {
  if (documents.copySourceOrderId === null) return;
  fd.append("copy_source_order_id", String(documents.copySourceOrderId));
  fd.append("copy_documents_json", buildCopyDocuments(documents));
}

export async function createOrder(p: CreatePayload): Promise<{ id: number }> {
  const newFiles = collectNewFiles(p.documents);
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("title", p.title);
    fd.append("company", p.company);
    fd.append("comment", p.comment);
    fd.append("customer_id", String(p.customer_id));
    fd.append("sum_amount", String(p.sum_amount));
    if (p.start_date) fd.append("start_date", p.start_date);
    fd.append("deadline", p.deadline);
    if (p.responses_deadline) fd.append("responses_deadline", p.responses_deadline);
    fd.append("requires_expert", String(p.requires_expert));
    fd.append("requires_license", String(p.requires_license));
    fd.append("work_type", p.work_type);
    fd.append("badge_codes_json", JSON.stringify(p.badge_codes));
    if (p.details) fd.append("details_json", JSON.stringify(p.details));
    appendCopySource(fd, p.documents);
    appendFiles(fd, p.documents, files);
    return fd;
  };
  const res = await stableMultipartFetch({
    input: `${API_URL}/orders/create-with-files`,
    method: "POST",
    files: newFiles,
    buildBody: build,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось создать заказ");
  return res.json();
}

export async function updateOrder(id: number, p: UpdatePayload): Promise<{ id: number }> {
  const newFiles = collectNewFiles(p.documents);
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("title", p.title);
    fd.append("company", p.company);
    fd.append("comment", p.comment);
    fd.append("sum_amount", String(p.sum_amount));
    if (p.start_date) fd.append("start_date", p.start_date);
    fd.append("deadline", p.deadline);
    if (p.responses_deadline) fd.append("responses_deadline", p.responses_deadline);
    fd.append("requires_expert", String(p.requires_expert));
    fd.append("requires_license", String(p.requires_license));
    fd.append("work_type", p.work_type);
    fd.append("badge_codes_json", JSON.stringify(p.badge_codes));
    if (p.details) fd.append("details_json", JSON.stringify(p.details));
    fd.append("keep_documents_json", buildKeepDocuments(p.documents));
    appendCopySource(fd, p.documents);
    fd.append("notify_responders", String(p.notify_responders));
    appendFiles(fd, p.documents, files);
    return fd;
  };
  const res = await stableMultipartFetch({
    input: `${API_URL}/orders/${id}/update-with-files`,
    method: "PATCH",
    files: newFiles,
    buildBody: build,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось обновить заказ");
  return res.json();
}

export async function deleteOrder(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/orders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось удалить заказ");
}
