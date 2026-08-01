import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type {
  DirectionCatalogs,
  DirectionDocument,
  DirectionKey,
  DirectionProfile,
  DirectionSummary,
} from "../model/types";

async function raise(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  const detail = body?.detail;
  if (typeof detail === "string") throw new Error(detail);
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") throw new Error(detail[0].msg);
  throw new Error(fallback);
}

export async function fetchDirectionCatalogs(): Promise<DirectionCatalogs> {
  const res = await fetch(`${API_URL}/directions/catalogs`, { cache: "no-store" });
  if (!res.ok) await raise(res, "Не удалось загрузить справочники");
  return res.json();
}

export async function fetchMyDirections(): Promise<DirectionSummary[]> {
  const res = await fetchWithSession(`${API_URL}/directions`);
  if (!res.ok) await raise(res, "Не удалось загрузить направления");
  return res.json();
}

export async function fetchDirectionProfile(key: DirectionKey): Promise<DirectionProfile> {
  const res = await fetchWithSession(`${API_URL}/directions/${key}/profile`);
  if (!res.ok) await raise(res, "Не удалось загрузить анкету направления");
  return res.json();
}

export async function saveDirectionProfile(
  key: DirectionKey,
  profile: DirectionProfile,
): Promise<DirectionProfile> {
  const res = await fetchWithSession(`${API_URL}/directions/${key}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) await raise(res, "Не удалось сохранить анкету направления");
  return res.json();
}

export async function uploadDirectionDocument(
  key: DirectionKey,
  file: File,
): Promise<DirectionDocument[]> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/directions/${key}/documents`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();
      formData.append("file", files[0]);
      return formData;
    },
  });
  if (!res.ok) await raise(res, "Не удалось загрузить документ");
  return (await res.json()).documents;
}

export async function deleteDirectionDocument(
  key: DirectionKey,
  url: string,
): Promise<DirectionDocument[]> {
  const res = await fetchWithSession(`${API_URL}/directions/${key}/documents`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) await raise(res, "Не удалось удалить документ");
  return (await res.json()).documents;
}
