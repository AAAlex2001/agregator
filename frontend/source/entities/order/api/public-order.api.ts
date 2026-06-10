import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { OrderDocuments } from "../model/types";

export interface PublicOrderBadge {
  text: string;
  variant: string;
}

export interface PublicOrderPreview {
  id: number;
  title: string;
  company: string | null;
  start_date?: string;
  date: string;
  sum: string;
  responses_deadline: string | null;
  badges: PublicOrderBadge[];
  comment: string;
  documents: OrderDocuments;
}

export async function fetchPublicOrder(uuid: string): Promise<PublicOrderPreview> {
  const res = await fetchWithSession(`${API_URL}/orders/public/${uuid}`);
  if (!res.ok) {
    throw new Error("Заказ не найден");
  }
  return res.json();
}
