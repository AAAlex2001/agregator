import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type {
  LicenseHolderUpdatePayload,
  UserProfile,
} from "@/source/entities/user";

export async function updateLicenseHolderProfile(
  payload: LicenseHolderUpdatePayload,
): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/license`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось сохранить лицензию"));
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
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить файл лицензии"));
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
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось загрузить карточку предприятия"));
  return res.json();
}

export async function deleteCompanyCard(): Promise<UserProfile> {
  const res = await fetchWithSession(`${API_URL}/settings/company-card`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось удалить карточку предприятия"));
  return res.json();
}

async function uploadRegulatoryDocument(file: File, endpoint: string, fallback: string): Promise<UserProfile> {
  const res = await stableMultipartFetch({
    input: `${API_URL}${endpoint}`,
    method: "POST",
    files: [file],
    buildBody: (files) => {
      const formData = new FormData();
      if (files[0]) formData.append("file", files[0]);
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, fallback));
  return res.json();
}

export function uploadMiningLicenseFile(file: File): Promise<UserProfile> {
  return uploadRegulatoryDocument(file, "/settings/mining-license-file", "Не удалось загрузить файл лицензии маркшейдера");
}

export function uploadSroDesignFile(file: File): Promise<UserProfile> {
  return uploadRegulatoryDocument(file, "/settings/sro-design-file", "Не удалось загрузить файл выписки СРО");
}

export function uploadLabAccreditationFile(file: File): Promise<UserProfile> {
  return uploadRegulatoryDocument(file, "/settings/lab-accreditation-file", "Не удалось загрузить файл аккредитации");
}
