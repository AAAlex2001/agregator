import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type {
  AuditCustomerProfile,
  AuditExpertProfile,
  CadastralExpertProfile,
  DirectionDocument,
  ExpertiseExpertProfile,
  ForensicExpertProfile,
} from "../model/profiles";
import type { DirectionCatalogs, DirectionKey, DirectionSummary } from "../model/types";

async function raise(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  const detail = body?.detail;
  if (typeof detail === "string") throw new Error(detail);
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") throw new Error(detail[0].msg);
  throw new Error(fallback);
}

async function get<T>(path: string, fallback: string): Promise<T> {
  const res = await fetchWithSession(`${API_URL}${path}`);
  if (!res.ok) await raise(res, fallback);
  return res.json();
}

async function put<T>(path: string, body: unknown, fallback: string): Promise<T> {
  const res = await fetchWithSession(`${API_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) await raise(res, fallback);
  return res.json();
}

const LOAD_FAILED = "Не удалось загрузить анкету направления";
const SAVE_FAILED = "Не удалось сохранить анкету направления";

export async function fetchDirectionCatalogs(): Promise<DirectionCatalogs> {
  const res = await fetch(`${API_URL}/directions/catalogs`, { cache: "no-store" });
  if (!res.ok) await raise(res, "Не удалось загрузить справочники");
  return res.json();
}

export function fetchMyDirections(): Promise<DirectionSummary[]> {
  return get("/directions", "Не удалось загрузить направления");
}

export function fetchExpertiseProfile(): Promise<ExpertiseExpertProfile> {
  return get("/directions/expertise/profile", LOAD_FAILED);
}

export function saveExpertiseProfile(
  profile: ExpertiseExpertProfile,
): Promise<ExpertiseExpertProfile> {
  return put("/directions/expertise/profile", profile, SAVE_FAILED);
}

export function fetchAuditExpertProfile(): Promise<AuditExpertProfile> {
  return get("/directions/audit-supb/profile", LOAD_FAILED);
}

export function saveAuditExpertProfile(profile: AuditExpertProfile): Promise<AuditExpertProfile> {
  return put("/directions/audit-supb/expert/profile", profile, SAVE_FAILED);
}

export function fetchAuditCustomerProfile(): Promise<AuditCustomerProfile> {
  return get("/directions/audit-supb/profile", LOAD_FAILED);
}

export function saveAuditCustomerProfile(
  profile: AuditCustomerProfile,
): Promise<AuditCustomerProfile> {
  return put("/directions/audit-supb/customer/profile", profile, SAVE_FAILED);
}

export function fetchCadastralProfile(): Promise<CadastralExpertProfile> {
  return get("/directions/cadastral/profile", LOAD_FAILED);
}

export function saveCadastralProfile(
  profile: CadastralExpertProfile,
): Promise<CadastralExpertProfile> {
  return put("/directions/cadastral/profile", profile, SAVE_FAILED);
}

export function fetchForensicProfile(): Promise<ForensicExpertProfile> {
  return get("/directions/forensic/profile", LOAD_FAILED);
}

export function saveForensicProfile(
  profile: ForensicExpertProfile,
): Promise<ForensicExpertProfile> {
  return put("/directions/forensic/profile", profile, SAVE_FAILED);
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
