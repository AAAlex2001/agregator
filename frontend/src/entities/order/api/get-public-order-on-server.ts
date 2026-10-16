import { SERVER_API_URL } from "@/shared/config/server-api";
import type { PublicOrder } from "../model/types";

/** Загружает актуальный публичный заказ на сервере для страницы и её метаданных. */
export async function getPublicOrderOnServer(
  publicId: string,
): Promise<PublicOrder> {
  const response = await fetch(`${SERVER_API_URL}/orders/public/${publicId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Заказ не найден");
  }

  return response.json();
}
