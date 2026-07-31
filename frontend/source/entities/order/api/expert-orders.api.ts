import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type { SortDir } from "@/source/shared/ui/SortPills";
import type { OrdersApiList, OrderSortBy } from "@/source/entities/order";

export async function fetchOrders(
  skip = 0,
  limit = 50,
  sort?: { sortBy?: OrderSortBy; sortDir?: SortDir },
): Promise<OrdersApiList> {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (sort?.sortBy) params.set("sort_by", sort.sortBy);
  if (sort?.sortDir) params.set("sort_dir", sort.sortDir);
  const res = await fetchWithSession(`${API_URL}/orders/?${params.toString()}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Не удалось загрузить заказы");
  return res.json();
}

interface RespondPayload {
  comment: string;
  proposed_sum_amount: number;
  proposed_start_date?: string;
  proposed_deadline: string;
  vat_kind: string;
  expert_inn: string;
  expert_company_data: Record<string, unknown>;
  files?: File[];
}

export async function respondToOrder(orderId: number, p: RespondPayload): Promise<void> {
  const build = (files: File[]) => {
    const fd = new FormData();
    fd.append("comment", p.comment);
    fd.append("proposed_sum_amount", String(p.proposed_sum_amount));
    if (p.proposed_start_date) fd.append("proposed_start_date", p.proposed_start_date);
    fd.append("proposed_deadline", p.proposed_deadline);
    fd.append("vat_kind", p.vat_kind);
    fd.append("expert_inn", p.expert_inn);
    fd.append("expert_company_data", JSON.stringify(p.expert_company_data));
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
