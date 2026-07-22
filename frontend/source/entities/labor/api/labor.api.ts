import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import type {
  LaborListingData,
  LaborListingKind,
  LaborListingPayload,
} from "../model/types";

export async function fetchPublicLaborListing(
  publicId: string,
  opts: { server?: boolean } = {},
): Promise<LaborListingData | null> {
  const base = opts.server ? SERVER_API_URL : API_URL;
  const res = await fetch(
    `${base}/labor/public/${encodeURIComponent(publicId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json() as Promise<LaborListingData>;
}

export async function fetchLaborListings(
  kind: LaborListingKind,
  mine: boolean,
): Promise<LaborListingData[]> {
  const params = new URLSearchParams({
    kind,
    mine: String(mine),
  });
  const response = await fetchWithSession(
    `${API_URL}/labor/listings?${params}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Не удалось загрузить заявки",
      ),
    );
  }

  const data = await response.json() as {
    items: LaborListingData[];
  };
  return data.items;
}

export async function createLaborListing(
  payload: LaborListingPayload,
): Promise<LaborListingData> {
  const response = await fetchWithSession(
    `${API_URL}/labor/listings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Не удалось создать заявку",
      ),
    );
  }

  return response.json() as Promise<LaborListingData>;
}

export async function closeLaborListing(id: number): Promise<void> {
  const response = await fetchWithSession(
    `${API_URL}/labor/listings/${id}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Не удалось закрыть заявку",
      ),
    );
  }
}

export async function contactLaborListing(id: number): Promise<string> {
  const response = await fetchWithSession(
    `${API_URL}/labor/listings/${id}/contact`,
    { method: "POST" },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Не удалось открыть чат",
      ),
    );
  }

  const data = await response.json() as {
    chat_uuid: string;
  };
  return data.chat_uuid;
}
