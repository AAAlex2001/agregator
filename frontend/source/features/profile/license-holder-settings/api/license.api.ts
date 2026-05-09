import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import type {
  LicenseHolderUpdatePayload,
  UserProfile,
} from "@/source/entities/user";

async function readError(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => null);
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail) && body.detail[0]?.msg) return String(body.detail[0].msg);
  return fallback;
}

export async function updateLicenseHolderProfile(
  payload: LicenseHolderUpdatePayload,
): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/license`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readError(res, "Не удалось сохранить лицензию"));
  return res.json();
}

export async function uploadLicenseFile(file: File): Promise<UserProfile> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/settings/license-file`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();
      if (files[0]) formData.append("file", files[0]);
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readError(res, "Не удалось загрузить файл лицензии"));
  return res.json();
}

export async function uploadCompanyCard(file: File): Promise<UserProfile> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/settings/company-card`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();
      if (files[0]) formData.append("file", files[0]);
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readError(res, "Не удалось загрузить карточку предприятия"));
  return res.json();
}

export async function deleteCompanyCard(): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/company-card`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res, "Не удалось удалить карточку предприятия"));
  return res.json();
}
