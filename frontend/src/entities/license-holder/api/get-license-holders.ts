import { request } from "@/shared/api/request";
import type { LicenseHolderListResponse } from "../model/types";

/** Загружает страницу каталога; сервер предоставляет её только исполнителю. */
export async function getLicenseHolders(
  skip = 0,
  limit = 20,
): Promise<LicenseHolderListResponse> {
  const parameters = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
  });
  const response = await request(`/license-holders/?${parameters}`, {
    errorMessage: "Не удалось загрузить держателей разрешительных документов",
  });

  return response.json();
}
