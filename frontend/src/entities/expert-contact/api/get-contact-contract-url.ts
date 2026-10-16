import { API_URL } from "@/shared/config/api";

/** Возвращает адрес скачивания PDF договора с авторизацией через cookie. */
export function getContactContractUrl(dealId: number): string {
  return `${API_URL}/contact-deals/${dealId}/contract.pdf`;
}
