import type { LicenseHolderSurveyRegisterPayload } from "@/source/entities/user";
import { deleteWithBody, getJson, postFile, putJson } from "../../shared/model/http";
import type {
  SurveyCatalogs,
  SurveyDocumentGroup,
  SurveyHolderProfile,
  SurveyProfile,
} from "./types";

type SurveyHolderProfileApi = Omit<SurveyHolderProfile, "liability_level" | "pricing_percent" | "pricing_fixed_amount"> & {
  liability_level: number;
  pricing_percent: number | null;
  pricing_fixed_amount: number | null;
};

export function surveyHolderProfileToApi(profile: SurveyHolderProfile): LicenseHolderSurveyRegisterPayload {
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

function holderProfileFromApi(data: SurveyHolderProfileApi): SurveyHolderProfile {
  return {
    ...data,
    liability_level: String(data.liability_level || 1),
    pricing_percent: data.pricing_percent === null ? "" : String(data.pricing_percent),
    pricing_fixed_amount: data.pricing_fixed_amount === null ? "" : String(data.pricing_fixed_amount),
  };
}

export function fetchSurveyCatalogs(): Promise<SurveyCatalogs> {
  return getJson("/directions/survey/catalogs", "Не удалось загрузить справочники направления");
}

export function fetchSurveyProfile(): Promise<SurveyProfile> {
  return getJson("/directions/survey/expert-profile", "Не удалось загрузить анкету изыскателя");
}

export function saveSurveyProfile(profile: SurveyProfile): Promise<SurveyProfile> {
  return putJson(
    "/directions/survey/expert-profile",
    profile,
    "Не удалось сохранить анкету изыскателя",
  );
}

export async function fetchSurveyHolderProfile(): Promise<SurveyHolderProfile> {
  const data = await getJson<SurveyHolderProfileApi>(
    "/directions/survey/license-holder-profile",
    "Не удалось загрузить анкету члена СРО",
  );
  return holderProfileFromApi(data);
}

export async function saveSurveyHolderProfile(
  profile: SurveyHolderProfile,
): Promise<SurveyHolderProfile> {
  const data = await putJson<SurveyHolderProfileApi>(
    "/directions/survey/license-holder-profile",
    surveyHolderProfileToApi(profile),
    "Не удалось сохранить анкету члена СРО",
  );
  return holderProfileFromApi(data);
}

export function uploadSurveyDocument(group: SurveyDocumentGroup, file: File): Promise<SurveyProfile> {
  return postFile(
    `/directions/survey/expert-profile/documents?group=${group}`,
    file,
    "Не удалось загрузить документ",
  );
}

export function deleteSurveyDocument(group: SurveyDocumentGroup, url: string): Promise<SurveyProfile> {
  return deleteWithBody(
    `/directions/survey/expert-profile/documents?group=${group}`,
    { url },
    "Не удалось удалить документ",
  );
}

export async function uploadSurveyHolderDocument(file: File): Promise<SurveyHolderProfile> {
  const data = await postFile<SurveyHolderProfileApi>(
    "/directions/survey/license-holder-profile/documents",
    file,
    "Не удалось загрузить документ",
  );
  return holderProfileFromApi(data);
}

export async function deleteSurveyHolderDocument(url: string): Promise<SurveyHolderProfile> {
  const data = await deleteWithBody<SurveyHolderProfileApi>(
    "/directions/survey/license-holder-profile/documents",
    { url },
    "Не удалось удалить документ",
  );
  return holderProfileFromApi(data);
}
