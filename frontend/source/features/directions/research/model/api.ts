import { getJson, putJson } from "../../shared/model/http";
import type { ResearchCatalogs, ResearchProfile } from "./types";

export function fetchResearchCatalogs(): Promise<ResearchCatalogs> {
  return getJson("/directions/research/catalogs", "Не удалось загрузить справочники направления");
}

export function fetchResearchProfile(): Promise<ResearchProfile> {
  return getJson("/directions/research/profile", "Не удалось загрузить анкету НИР");
}

export function saveResearchProfile(profile: ResearchProfile): Promise<ResearchProfile> {
  return putJson("/directions/research/profile", profile, "Не удалось сохранить анкету НИР");
}
