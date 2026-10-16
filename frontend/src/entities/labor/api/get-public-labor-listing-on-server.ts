import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { LaborListing } from "../model/types";

/** Загружает объявление по публичной ссылке; недоступное возвращает как null. */
export async function getPublicLaborListingOnServer(
  publicId: string,
): Promise<LaborListing | null> {
  const path = `/labor/public/${encodeURIComponent(publicId)}`;
  const response = await fetch(`${SERVER_API_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
