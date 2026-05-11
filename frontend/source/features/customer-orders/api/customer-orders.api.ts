import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { OrdersApiList } from "@/source/entities/order";
import type { DocumentsFormState } from "../model/formFiles";

export async function fetchCustomerOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить заказы");
  return res.json();
}

interface CreatePayload {
  title: string; company: string; comment: string;
  customer_id: number; sum_amount: number; deadline: string;
  responses_deadline?: string; badge_codes: string[];
  documents: DocumentsFormState;
}

interface UpdatePayload {
  title: string; company: string; comment: string;
  sum_amount: number; deadline: string; responses_deadline?: string;
  badge_codes: string[]; documents: DocumentsFormState;
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
  return JSON.stringify({
    technical: documents.technical.existing ? [documents.technical.existing] : [],
    contract: documents.contract.existing ? [documents.contract.existing] : [],
    company: documents.company.existing ? [documents.company.existing] : [],
    other: documents.other.existing,
  });
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
    fd.append("deadline", p.deadline);
    if (p.responses_deadline) fd.append("responses_deadline", p.responses_deadline);
    fd.append("badge_codes_json", JSON.stringify(p.badge_codes));
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
    fd.append("deadline", p.deadline);
    if (p.responses_deadline) fd.append("responses_deadline", p.responses_deadline);
    fd.append("badge_codes_json", JSON.stringify(p.badge_codes));
    fd.append("keep_documents_json", buildKeepDocuments(p.documents));
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
