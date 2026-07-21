import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type {
  ContactDealDetail,
  ContactDealListItem,
  ExpertContactCardData,
  ExpertContactOfferData,
} from "../model/types";

async function ensureResponse(response: Response, fallback: string): Promise<Response> {
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, fallback));
  }
  return response;
}

export async function fetchExpertContacts(search = ""): Promise<ExpertContactCardData[]> {
  const params = new URLSearchParams({ limit: "500" });
  if (search.trim()) params.set("search", search.trim());
  const response = await fetchWithSession(`${API_URL}/expert-contacts?${params}`, {
    cache: "no-store",
  });
  await ensureResponse(response, "Не удалось загрузить контакты экспертов");
  const data = await response.json() as { items: ExpertContactCardData[] };
  return data.items;
}

export async function fetchContactOffer(): Promise<ExpertContactOfferData> {
  const response = await fetchWithSession(`${API_URL}/expert-contacts/offer`, {
    cache: "no-store",
  });
  await ensureResponse(response, "Не удалось загрузить настройки контактов");
  return response.json() as Promise<ExpertContactOfferData>;
}

export async function updateContactOffer(payload: {
  enabled: boolean;
  price_rubles?: number;
  payment_details?: string;
  disclosure_consent?: boolean;
}): Promise<ExpertContactOfferData> {
  const response = await fetchWithSession(`${API_URL}/expert-contacts/offer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await ensureResponse(response, "Не удалось сохранить настройки контактов");
  return response.json() as Promise<ExpertContactOfferData>;
}

export async function createContactDeal(sellerId: number): Promise<ContactDealDetail> {
  const response = await fetchWithSession(`${API_URL}/contact-deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seller_id: sellerId }),
  });
  await ensureResponse(response, "Не удалось создать договор");
  return response.json() as Promise<ContactDealDetail>;
}

export async function fetchContactDeals(): Promise<ContactDealListItem[]> {
  const response = await fetchWithSession(`${API_URL}/contact-deals`, {
    cache: "no-store",
  });
  await ensureResponse(response, "Не удалось загрузить сделки");
  const data = await response.json() as { items: ContactDealListItem[] };
  return data.items;
}

export async function fetchContactDeal(id: number): Promise<ContactDealDetail> {
  const response = await fetchWithSession(`${API_URL}/contact-deals/${id}`, {
    cache: "no-store",
  });
  await ensureResponse(response, "Не удалось загрузить сделку");
  return response.json() as Promise<ContactDealDetail>;
}

export async function signContactDeal(id: number, password: string): Promise<ContactDealDetail> {
  const response = await fetchWithSession(`${API_URL}/contact-deals/${id}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, accepted: true }),
  });
  await ensureResponse(response, "Не удалось подписать договор");
  return response.json() as Promise<ContactDealDetail>;
}

export async function uploadContactReceipt(id: number, file: File): Promise<ContactDealDetail> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetchWithSession(`${API_URL}/contact-deals/${id}/receipt`, {
    method: "POST",
    body: form,
  });
  await ensureResponse(response, "Не удалось загрузить чек");
  return response.json() as Promise<ContactDealDetail>;
}

export async function confirmContactPayment(id: number): Promise<ContactDealDetail> {
  const response = await fetchWithSession(
    `${API_URL}/contact-deals/${id}/confirm-payment`,
    { method: "POST" },
  );
  await ensureResponse(response, "Не удалось подтвердить оплату");
  return response.json() as Promise<ContactDealDetail>;
}

export async function rejectContactPayment(
  id: number,
  reason: string,
): Promise<ContactDealDetail> {
  const response = await fetchWithSession(
    `${API_URL}/contact-deals/${id}/reject-payment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    },
  );
  await ensureResponse(response, "Не удалось отклонить чек");
  return response.json() as Promise<ContactDealDetail>;
}

export function contactContractUrl(id: number): string {
  return `${API_URL}/contact-deals/${id}/contract.pdf`;
}
