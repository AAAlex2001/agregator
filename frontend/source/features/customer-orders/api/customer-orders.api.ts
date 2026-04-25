import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { OrdersApiList } from "@/source/entities/order";

export async function fetchCustomerOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить заказы");
  return res.json();
}

interface CreatePayload {
  title: string; company: string; comment: string;
  customer_id: number; sum_amount: number; deadline: string;
  responses_deadline?: string; badge_codes: string[];
  files?: File[];
}

export async function createOrder(p: CreatePayload): Promise<{ id: number }> {
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
    for (const f of files) fd.append("files", f);
    return fd;
  };
  const res = await stableMultipartFetch({ input: `${API_URL}/orders/create-with-files`, method: "POST", files: p.files ?? [], buildBody: build });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось создать заказ");
  return res.json();
}

interface UpdatePayload {
  title: string; company: string; comment: string;
  sum_amount: number; deadline: string; responses_deadline?: string;
  badge_codes: string[]; files?: File[]; keepFiles?: string[];
}

export async function updateOrder(id: number, p: UpdatePayload): Promise<{ id: number }> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("title", p.title);
    fd.append("company", p.company);
    fd.append("comment", p.comment);
    fd.append("sum_amount", String(p.sum_amount));
    fd.append("deadline", p.deadline);
    if (p.responses_deadline) fd.append("responses_deadline", p.responses_deadline);
    fd.append("badge_codes_json", JSON.stringify(p.badge_codes));
    fd.append("keep_files", JSON.stringify(p.keepFiles ?? []));
    for (const f of files) fd.append("files", f);
    return fd;
  };
  const res = await stableMultipartFetch({ input: `${API_URL}/orders/${id}/update-with-files`, method: "PATCH", files: p.files ?? [], buildBody: build });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось обновить заказ");
  return res.json();
}

export async function deleteOrder(id: number): Promise<void> {
  const res = await fetchWithSession(`${API_URL}/orders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось удалить заказ");
}
