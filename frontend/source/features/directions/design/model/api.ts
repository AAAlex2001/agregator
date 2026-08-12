import type { LicenseHolderDesignRegisterPayload } from "@/source/entities/user";
import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type {
  DesignCatalogs,
  DesignDocumentGroup,
  DesignHolderProfile,
  DesignProfile,
} from "./types";

type DesignHolderProfileApi = Omit<DesignHolderProfile, "liability_level" | "pricing_percent" | "pricing_fixed_amount"> & {
  liability_level: number;
  pricing_percent: number | null;
  pricing_fixed_amount: number | null;
};

export function holderProfileToApi(profile: DesignHolderProfile): LicenseHolderDesignRegisterPayload {
  return {
    sro_name: profile.sro_name,
    sro_registry_number: profile.sro_registry_number,
    hazardous_objects_right: profile.hazardous_objects_right,
    nuclear_objects_right: profile.nuclear_objects_right,
    liability_level: Number(profile.liability_level) || 1,
    pricing_kind: profile.pricing_kind,
    pricing_percent:
      profile.pricing_kind === "PERCENT" && profile.pricing_percent
        ? Number(profile.pricing_percent.replace(",", "."))
        : null,
    pricing_fixed_amount:
      profile.pricing_kind === "FIXED" && profile.pricing_fixed_amount
        ? Number(profile.pricing_fixed_amount.replace(/\s/g, ""))
        : null,
  };
}

function holderProfileFromApi(data: DesignHolderProfileApi): DesignHolderProfile {
  return {
    ...data,
    liability_level: String(data.liability_level || 1),
    pricing_percent: data.pricing_percent === null ? "" : String(data.pricing_percent),
    pricing_fixed_amount: data.pricing_fixed_amount === null ? "" : String(data.pricing_fixed_amount),
  };
}

export function fetchDesignCatalogs(): Promise<DesignCatalogs> {
  return getJson("/directions/design/catalogs", "Не удалось загрузить справочники направления");
}

export function fetchDesignProfile(): Promise<DesignProfile> {
  return getJson("/directions/design/expert-profile", "Не удалось загрузить анкету проектировщика");
}

export function saveDesignProfile(profile: DesignProfile): Promise<DesignProfile> {
  return putJson(
    "/directions/design/expert-profile",
    profile,
    "Не удалось сохранить анкету проектировщика",
  );
}

export async function fetchDesignHolderProfile(): Promise<DesignHolderProfile> {
  const data = await getJson<DesignHolderProfileApi>(
    "/directions/design/license-holder-profile",
    "Не удалось загрузить анкету члена СРО",
  );
  return holderProfileFromApi(data);
}

export async function saveDesignHolderProfile(
  profile: DesignHolderProfile,
): Promise<DesignHolderProfile> {
  const data = await putJson<DesignHolderProfileApi>(
    "/directions/design/license-holder-profile",
    holderProfileToApi(profile),
    "Не удалось сохранить анкету члена СРО",
  );
  return holderProfileFromApi(data);
}

export function uploadDesignDocument(group: DesignDocumentGroup, file: File): Promise<DesignProfile> {
  return postFile(
    `/directions/design/expert-profile/documents?group=${group}`,
    file,
    "Не удалось загрузить документ",
  );
}

export function deleteDesignDocument(group: DesignDocumentGroup, url: string): Promise<DesignProfile> {
  return deleteWithBody(
    `/directions/design/expert-profile/documents?group=${group}`,
    { url },
    "Не удалось удалить документ",
  );
}

export async function uploadDesignHolderDocument(file: File): Promise<DesignHolderProfile> {
  const data = await postFile<DesignHolderProfileApi>(
    "/directions/design/license-holder-profile/documents",
    file,
    "Не удалось загрузить документ",
  );
  return holderProfileFromApi(data);
}

export async function deleteDesignHolderDocument(url: string): Promise<DesignHolderProfile> {
  const data = await deleteWithBody<DesignHolderProfileApi>(
    "/directions/design/license-holder-profile/documents",
    { url },
    "Не удалось удалить документ",
  );
  return holderProfileFromApi(data);
}
