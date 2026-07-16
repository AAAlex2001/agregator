import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
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

export async function fetchPublicOrder(
  uuid: string,
  options: { server?: boolean } = {},
): Promise<PublicOrderPreview> {
  const url = `${options.server ? SERVER_API_URL : API_URL}/orders/public/${uuid}`;
  const res = options.server
    ? await fetch(url, { cache: "no-store" })
    : await fetchWithSession(url);
  if (!res.ok) {
    throw new Error("Заказ не найден");
  }
  return res.json();
}
