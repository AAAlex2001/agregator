import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { LicenseHolderListResponse } from "../model/types";

export async function fetchLicenseHolders(skip = 0, limit = 20): Promise<LicenseHolderListResponse> {
  const url = new URL(`${API_URL}/license-holders/`, "http://placeholder");
  url.searchParams.set("skip", String(skip));
  url.searchParams.set("limit", String(limit));
  const target = `${API_URL}/license-holders/?${url.searchParams.toString()}`;

  const res = await fetchWithSession(target);
  if (!res.ok) throw new Error("Не удалось загрузить лицензиатов");
  return res.json();
}
