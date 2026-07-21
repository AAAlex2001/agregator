import type {
  AdminContactDealDetail,
  AdminContactDealListItem,
  ContactDealStatus,
} from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export async function listContactDeals(
  status?: ContactDealStatus,
): Promise<{ items: AdminContactDealListItem[]; total: number }> {
  const query = status ? `?status=${status}` : "";
  const response = await fetch(`${base}/api/contact-deals${query}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить сделки");
  return response.json();
}

export async function loadContactDeal(id: number): Promise<AdminContactDealDetail> {
  const response = await fetch(`${base}/api/contact-deals/${id}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить сделку");
  return response.json();
}

export async function releaseContactDeal(
  id: number,
  note: string,
): Promise<AdminContactDealDetail> {
  const response = await fetch(`${base}/api/contact-deals/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(data?.detail || "Не удалось открыть контакты");
  }
  return response.json();
}

export function adminReceiptUrl(dealId: number, receiptId: number): string {
  return `${base}/api/contact-deals/${dealId}/receipts/${receiptId}`;
}
