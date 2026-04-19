import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type { OrdersApiList } from "@/source/entities/order";

export async function fetchOrders(skip = 0, limit = 50): Promise<OrdersApiList> {
  const res = await fetchWithSession(`${API_URL}/orders/?skip=${skip}&limit=${limit}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить заказы");
  return res.json();
}

interface RespondPayload {
  comment: string;
  proposed_sum_amount: number;
  proposed_deadline: string;
  files?: File[];
}

export async function respondToOrder(orderId: number, p: RespondPayload): Promise<void> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("comment", p.comment);
    fd.append("proposed_sum_amount", String(p.proposed_sum_amount));
    fd.append("proposed_deadline", p.proposed_deadline);
    for (const f of files) fd.append("files", f);
    return fd;
  };
  const res = await stableMultipartFetch({
    input: `${API_URL}/orders/${orderId}/responses`,
    method: "POST", files: p.files ?? [], buildBody: build,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось отправить отклик");
}

export async function createPayment(amount: number, returnUrl: string): Promise<{ confirmation_url: string }> {
  const res = await fetchWithSession(`${API_URL}/payments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, return_url: returnUrl }),
  });
  if (!res.ok) throw new Error("Ошибка создания платежа");
  return res.json();
}
